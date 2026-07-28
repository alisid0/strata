<script>
  import ArcadeShell from './ArcadeShell.svelte';import {fly} from 'svelte/transition';import {onMount} from 'svelte';
  export let config;export let onDone=()=>{};export let onExit=()=>{};
  const reduceMotion=typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  const W=380,H=440,CX=W/2,CY=H/2;let c,ctx,af,recorded=false;
  let phase='briefing',levelIx=0,score=0,frame=0,params={a:80,b:80,h:0,k:0};
  let debris=[],debrisSet=null,currentTarget=0,captured=0,caught,levelData,stars=[];
  for(let i=0;i<80;i++)stars.push({x:Math.random()*W,y:Math.random()*H,r:.4+Math.random()*1.2,b:.15+Math.random()*.45});

  const LEVELS=[{name:'Orbit Match',params:['a','b'],centerLocked:true,
    briefing:'Stretch the forcefield.\n  ■ H-RADIUS — horizontal reach\n  ■ V-RADIUS — vertical reach\n\nA circle has equal radii.\nAn ellipse stretches one direction.',
    debris:[[{x:100,y:90},{x:-80,y:-70},{x:110,y:-50}],[{x:70,y:-90},{x:-100,y:40},{x:-50,y:-80}],[{x:120,y:20},{x:40,y:110},{x:-110,y:-15}]],
    reveal:'H-RADIUS stretches horizontally.\nV-RADIUS stretches vertically.\n\nA CIRCLE: a = b.\nAn ELLIPSE: a ≠ b.'},
  {name:'Center Shift',params:['a','b','h','k'],centerLocked:false,
    briefing:'New: X-CENTER slide left/right, Y-CENTER up/down.\nPlus H-RADIUS and V-RADIUS.',
    debris:[[{x:60,y:-60},{x:-90,y:70},{x:80,y:90}],[{x:-100,y:-80},{x:50,y:-90},{x:110,y:30}],[{x:-70,y:70},{x:90,y:-50},{x:-110,y:-15}]],
    reveal:'X-CENTER = h, Y-CENTER = k.\n(x−h)²/a² + (y−k)²/b² = 1\n\nh,k move it. a,b shape it.'},
  {name:'Root Access',params:['a','b','h','k'],centerLocked:false,
    briefing:'⚠ LABELS FAILING ⚠\nRaw math only.',
    debris:[[{x:50,y:70},{x:-80,y:-50},{x:100,y:-30},{x:-60,y:80}],[{x:90,y:-80},{x:-50,y:90},{x:110,y:40},{x:-100,y:-25}],[{x:0,y:100},{x:80,y:60},{x:-90,y:-60},{x:60,y:-90}]],
    reveal:'(x−h)²/a² + (y−k)²/b² = 1\nh,k=center a=semi-major b=semi-minor\nCircle: a=b. Ellipse: a≠b.\n★ ORBIT ARCHITECT ★'}];
  $:lv=LEVELS[levelIx];$:tgt=lv.debris[currentTarget];

  function startGame(){levelIx=0;score=0;currentTarget=0;params={a:80,b:80,h:0,k:0};loadLevel()}
  function loadLevel(){levelData=LEVELS[levelIx];debrisSet=levelData.debris[currentTarget];caught={};captured=0;phase='playing';if(levelData.centerLocked){params.h=0;params.k=0}debris=debrisSet.map((d,i)=>({...d,id:i,caught:false,dx:(Math.random()-.5)*.3,dy:(Math.random()-.5)*.3}))}
  function inside(x,y){return((x-params.h)/params.a)**2+((y-params.k)/params.b)**2<=1}
  function checkCapture(){for(const d of debris){if(d.caught)continue;if(inside(d.x,d.y)){d.caught=true;caught[d.id]=true;captured++;score++}}if(captured>=debrisSet.length){phase='success';setTimeout(()=>{if(currentTarget<levelData.debris.length-1){currentTarget++;loadLevel()}else{phase='reveal'}},1200)}}
  function finishGame(){if(recorded)return;recorded=true;onDone({id:config.id,reward:Math.min(15,6+score*2),arcadeScore:score*100,levelsCleared:3,perfectLevels:score>=lv.debris.length?3:2,patternFound:true,compared:true,usedHint:false})}

  function handleKey(e){if(phase!=='playing')return;const k=e.key.toLowerCase(),l=LEVELS[levelIx];if(l.params.includes('a')){if(k==='a')params.a=Math.max(20,params.a-4);if(k==='d')params.a=Math.min(180,params.a+4)}if(l.params.includes('b')){if(k==='w')params.b=Math.min(180,params.b+4);if(k==='s')params.b=Math.max(20,params.b-4)}if(!l.centerLocked){if(k==='arrowleft'||k==='j')params.h=Math.max(-180,params.h-4);if(k==='arrowright'||k==='l')params.h=Math.min(180,params.h+4);if(k==='arrowup'||k==='i')params.k=Math.min(180,params.k+4);if(k==='arrowdown'||k==='k')params.k=Math.max(-180,params.k-4)}checkCapture();e.preventDefault()}

  function draw(){
    const d=document.documentElement.getAttribute('data-qx-theme')==='dark';
    ctx.fillStyle=d?'#141310':'#F2EFE8';ctx.fillRect(0,0,W,H);
    for(const s of stars){ctx.fillStyle=`color-mix(in srgb, var(--qx-accent) ${s.b*100}%, transparent)`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill()}
    const p=1+Math.sin(frame*.02)*.03;let g=ctx.createRadialGradient(CX,CY,10*p,CX,CY,58*p);g.addColorStop(0,'var(--qx-accent)');g.addColorStop(.3,'color-mix(in srgb, var(--qx-accent) 60%, transparent)');g.addColorStop(.7,'color-mix(in srgb, var(--qx-accent) 10%, transparent)');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.beginPath();ctx.arc(CX,CY,58*p,0,Math.PI*2);ctx.fill();ctx.fillStyle='var(--qx-accent)';ctx.beginPath();ctx.arc(CX,CY,8,0,Math.PI*2);ctx.fill();ctx.strokeStyle='color-mix(in srgb, var(--qx-accent) 15%, transparent)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(CX,CY,80,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(CX,CY,120,0,Math.PI*2);ctx.stroke();
    const ex=params.h+CX,ey=params.k+CY,a=params.a,b=params.b;ctx.beginPath();ctx.ellipse(ex,ey,a,b,0,0,Math.PI*2);g=ctx.createRadialGradient(ex,ey,Math.min(a,b)*.3,ex,ey,Math.max(a,b));g.addColorStop(0,'color-mix(in srgb, var(--qx-accent) 0%, transparent)');g.addColorStop(.5,'color-mix(in srgb, var(--qx-accent) 15%, transparent)');g.addColorStop(1,'color-mix(in srgb, var(--qx-accent) 0%, transparent)');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='var(--qx-accent)';ctx.lineWidth=2.5;ctx.stroke();ctx.fillStyle='var(--qx-text)';ctx.beginPath();ctx.arc(ex,ey,3,0,Math.PI*2);ctx.fill();
    for(const db of debris){if(db.caught){ctx.fillStyle='var(--qx-green)';ctx.globalAlpha=.6;ctx.beginPath();ctx.arc(db.x+CX,db.y+CY,3,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;continue}db.x+=db.dx;db.y+=db.dy;if(Math.abs(db.x)>190)db.dx*=-1;if(Math.abs(db.y)>210)db.dy*=-1;ctx.fillStyle='var(--qx-yellow)';ctx.beginPath();ctx.arc(db.x+CX,db.y+CY,4,0,Math.PI*2);ctx.fill()}
    if(levelData){ctx.fillStyle=d?'#1C1A16cc':'#FCFBF8cc';ctx.fillRect(0,0,W,26);ctx.fillStyle='var(--qx-text-dim)';ctx.font='bold 9px var(--qx-font)';ctx.fillText(`SWEEP ${currentTarget+1}/${levelData.debris.length}`,10,17);ctx.fillText(`CAPTURED ${captured}/${debrisSet.length}`,W-130,17);
    const sy=H-90,active=levelData.params,labels={a:'H-R',b:'V-R',h:'X-C',k:'Y-C'},kd={a:'A/D',b:'W/S',h:'J/L',k:'I/K'};active.forEach((key,i)=>{const x=12+(W-24)*i/active.length,w=(W-24)/active.length-8;ctx.fillStyle='var(--qx-text-faint)';ctx.font='bold 9px var(--qx-font)';let dv=levelIx>1?(key==='a'?'a='+Math.round(params[key]):key==='b'?'b='+Math.round(params[key]):key==='h'?'h='+Math.round(params[key]):'k='+Math.round(params[key])):Math.round(params[key]);ctx.fillText(labels[key]+' '+dv,x,sy+18);ctx.fillStyle='var(--qx-border)';ctx.fillRect(x,sy+26,w,8);ctx.fillStyle='var(--qx-accent)';ctx.fillRect(x,sy+26,w*((params[key]-(key==='h'||key==='k'?-180:0))/360),8);ctx.fillStyle='var(--qx-text-faint)';ctx.font='8px var(--qx-font)';ctx.fillText(kd[key],x,sy+52)})}
    if(phase==='success'){ctx.fillStyle='color-mix(in srgb, var(--qx-green) 10%, transparent)';ctx.fillRect(0,0,W,H);ctx.fillStyle='var(--qx-green-text)';ctx.font='bold 20px var(--qx-font)';ctx.textAlign='center';ctx.fillText('ORBIT SECURED',W/2,H/2-20);ctx.textAlign='start'}
  }
  function loop(){frame++;if(phase!=='briefing'&&phase!=='reveal')draw();af=requestAnimationFrame(loop)}
  onMount(()=>{ctx=c.getContext('2d');startGame();af=requestAnimationFrame(loop);window.addEventListener('keydown',handleKey);return()=>{cancelAnimationFrame(af);window.removeEventListener('keydown',handleKey)}});
</script>
<svelte:window on:keydown={handleKey}/>
<ArcadeShell eyebrow={config.eyebrow} title={config.title} level={score} totalLevels={lv.debris.length} score={score*100} streak={score>2?score:0} onExit={onExit}>
  {#if phase==='briefing'}
    <div class="b" in:fly={{x:reduceMotion?0:16,duration:reduceMotion?0:200}}><h2>{lv.name}</h2><p style="white-space:pre-line">{lv.briefing}</p><button class="p" on:click={()=>phase='playing'}>Begin</button></div>
  {:else if phase==='reveal'}
    <div class="r" in:fly={{x:reduceMotion?0:16,duration:reduceMotion?0:200}}><div class="k">Decoded</div><h2>{lv.name}</h2><p style="white-space:pre-line;color:var(--qx-green-text)">{lv.reveal}</p><p style="color:var(--qx-accent-text);font-weight:900">★ {score} debris captured ★</p>
      {#if levelIx<2}<button class="p" on:click={()=>{levelIx++;currentTarget=0;loadLevel()}}>Next satellite</button>
      {:else}<div class="ra"><button class="p" on:click={()=>{finishGame();onExit()}}>Return to workshops</button><button class="s" on:click={()=>{levelIx=0;currentTarget=0;score=0;recorded=false;loadLevel()}}>Play again</button></div>{/if}</div>
  {:else}
    <canvas bind:this={c} class="pf" width={W} height={H} aria-label="Orbit Architect. Stretch the ellipse to capture debris."></canvas>
  {/if}
</ArcadeShell>
<style>.b,.r,.game-area{display:flex;flex-direction:column;gap:10px;padding:0 4px}.b,.r{align-items:center;text-align:center}.k{color:var(--qx-accent-text);font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase}h2{font-size:20px;line-height:1.15;margin:4px 0 6px;font-weight:950}p{color:var(--qx-text-dim);font-size:13px;line-height:1.5;margin:0}.pf{width:100%;border:1px solid var(--qx-border);border-radius:14px;background:var(--qx-bg)}.p,.s{min-height:46px;width:100%;border-radius:999px;font-family:var(--qx-font);font-size:14px;font-weight:900;cursor:pointer}.p{border:none;background:var(--qx-accent);color:var(--qx-bg)}.s{border:1.5px solid var(--qx-border-2);background:var(--qx-surface);color:var(--qx-text-dim);margin-top:6px}.ra{width:100%;display:grid;gap:7px}</style>
