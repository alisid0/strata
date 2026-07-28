<script>
  // Signal Hacker — Solve First sine wave transformation arcade game.
  // Three vaults: match amplitude/frequency, add phase/vertical shift,
  // then decode the full sine formula. Uses Qubix design tokens.
  import ArcadeShell from './ArcadeShell.svelte';
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';

  export let config;
  export let onDone = () => {};
  export let onExit = () => {};

  const reduceMotion = typeof matchMedia !== 'undefined'
    && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const W = 380, H = 440;
  let canvasEl, ctx, animFrame, recorded = false;

  // Game state
  let phase = 'briefing'; let levelIx = 0; let score = 0; let frame = 0;
  let params = { amp: 1, freq: 1, phase: 0, vShift: 0 };
  let target = { amp: 0, freq: 0, phase: 0, vShift: 0 };
  let matchPct = 0; let unlocked = false; let currentTarget = 0;
  let scanLine = 0; let glitchTimer = 0;

  // Level configs
  const LEVELS = [
    { name: 'Signal Match', params: ['amp','freq'],
      briefing: 'Two controls:\n  ■ VOLUME — wave height\n  ■ PITCH — cycle speed\n\nMatch the target (green).\nYour signal is the bright one.',
      targets: [
        { amp: 60, freq: 2.0, phase: 0, vShift: 0 },
        { amp: 90, freq: 1.0, phase: 0, vShift: 0 },
        { amp: 40, freq: 3.5, phase: 0, vShift: 0 }
      ],
      reveal: 'VOLUME = AMPLITUDE.\nPITCH = FREQUENCY.\n\nAmplitude: wave height from center.\nFrequency: cycles across the screen.\n\nYou just tuned a sine wave.' },
    { name: 'Phase Shift', params: ['amp','freq','phase','vShift'],
      briefing: 'Four controls now:\n  ■ H-SHIFT — slide left/right\n  ■ V-SHIFT — lift whole wave\n\nPlus VOLUME and PITCH.',
      targets: [
        { amp: 70, freq: 2.0, phase: 1.5, vShift: 0 },
        { amp: 60, freq: 1.5, phase: 0, vShift: 50 },
        { amp: 80, freq: 2.5, phase: 0.8, vShift: -30 }
      ],
      reveal: 'H-SHIFT = PHASE SHIFT (φ).\nV-SHIFT = VERTICAL TRANSLATION (D).\n\nf(x) = A·sin(ωx + φ) + D\n\nEvery term is under your control.' },
    { name: 'Root Access', params: ['amp','freq','phase','vShift'],
      briefing: '⚠ LABELS FAILING ⚠\n\nRaw math only.\nYou already know what these do.',
      targets: [
        { amp: 50, freq: 3.0, phase: 0.5, vShift: 20, glitch: true },
        { amp: 100, freq: 0.8, phase: 2.0, vShift: -40, glitch: true },
        { amp: 70, freq: 1.8, phase: 1.0, vShift: 0, glitch: true }
      ],
      reveal: 'YOU MASTERED SINE WAVES.\n\nf(x) = A·sin(ωx + φ) + D\n\nA = amplitude  ω = frequency\nφ = phase shift  D = vertical shift\n\n★ SIGNAL HACKER ★' }
  ];

  $: level = LEVELS[levelIx];
  $: tgt = level.targets[currentTarget];
  $: missionHUD = `VAULT ${levelIx+1} · LOCK ${currentTarget+1}/${level.targets.length}`;

  function initLevel(lvl) {
    levelIx = lvl; currentTarget = 0; score = 0; matchPct = 0; unlocked = false; phase = 'briefing';
    randomizeParams();
  }

  function loadTarget() {
    target = { ...tgt };
    randomizeParams();
    matchPct = 0; unlocked = false; phase = 'playing';
  }

  function randomizeParams() {
    params = {
      amp: 25 + Math.random() * 35,
      freq: 1.5 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
      vShift: (Math.random() - 0.5) * 60
    };
  }

  function computeMatch() {
    const active = level.params; let total = 0;
    const ranges = { amp: 60, freq: 2.5, phase: Math.PI, vShift: 80 };
    for (const key of active) {
      let diff = key === 'phase'
        ? Math.min(Math.abs(params[key]-target[key]), Math.PI*2-Math.abs(params[key]-target[key]))
        : Math.abs(params[key]-target[key]);
      total += Math.max(0, 1 - diff / Math.max(ranges[key], 1));
    }
    matchPct = Math.round((total / active.length) * 100);
    if (matchPct >= 85) unlocked = true;
  }

  function crackVault() {
    if (!unlocked || phase !== 'playing') return;
    phase = 'success'; score++;
    setTimeout(() => {
      if (currentTarget < level.targets.length - 1) { currentTarget++; loadTarget(); }
      else { phase = 'reveal'; }
    }, 1200);
  }

  function finishGame() {
    if (recorded) return; recorded = true;
    onDone({ id: config.id, reward: Math.min(15, 6 + score*2), arcadeScore: score*100,
      levelsCleared: 3, perfectLevels: score >= level.targets.length ? 3 : 2,
      patternFound: true, compared: true, transferFirstTry: true, usedHint: false });
  }

  function restart() { initLevel(0); recorded = false; phase = 'briefing'; }

  // Input
  const keyMap = { '1':['amp',-5], 'q':['amp',5], '2':['freq',-0.2], 'w':['freq',0.2],
    '3':['phase',-0.2], 'e':['phase',0.2], '4':['vShift',-6], 'r':['vShift',6] };

  function handleKeydown(e) {
    if (phase !== 'playing') return;
    const bind = keyMap[e.key];
    if (bind) {
      const [k, d] = bind; params[k] += d;
      if (k==='amp') params[k]=Math.max(5,Math.min(120,params[k]));
      if (k==='freq') params[k]=Math.max(0.2,Math.min(5,params[k]));
      if (k==='phase') params[k]=((params[k]%(Math.PI*2))+Math.PI*2)%(Math.PI*2);
      if (k==='vShift') params[k]=Math.max(-80,Math.min(80,params[k]));
      computeMatch(); e.preventDefault();
    }
    if (e.key===' ' && unlocked) { crackVault(); e.preventDefault(); }
  }

  // Touch slider
  let touchActive = null;
  function touchStart(e) {
    if (phase!=='playing') return;
    const rect = canvasEl.getBoundingClientRect();
    const py = (e.touches[0].clientY-rect.top)*(H/rect.height);
    if (py > H*0.72) {
      const px = (e.touches[0].clientX-rect.left)*(W/rect.width);
      const idx = Math.floor((px/W)*level.params.length);
      if (idx>=0 && idx<level.params.length) touchActive = idx;
    }
    e.preventDefault();
  }
  function touchMove(e) {
    if (touchActive===null) return;
    const rect = canvasEl.getBoundingClientRect();
    const px = (e.touches[0].clientX-rect.left)*(W/rect.width);
    const key = level.params[touchActive]; const val = px/W;
    if (key==='amp') params[key]=5+val*115;
    if (key==='freq') params[key]=0.2+val*4.8;
    if (key==='phase') params[key]=val*Math.PI*2;
    if (key==='vShift') params[key]=-80+val*160;
    computeMatch(); e.preventDefault();
  }
  function touchEnd() { touchActive=null; }

  // Rendering
  function waveFn(base) {
    return (x) => base.amp * Math.sin(base.freq*(x/W)*Math.PI*2 + base.phase) + base.vShift;
  }

  function draw() {
    const d = document.documentElement.getAttribute('data-qx-theme')==='dark';
    ctx.fillStyle = d ? '#141310' : '#F2EFE8'; ctx.fillRect(0,0,W,H);

    // Grid
    ctx.strokeStyle = 'var(--qx-border)'; ctx.lineWidth=0.5; ctx.globalAlpha=0.3;
    for (let x=0;x<W;x+=36){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for (let y=0;y<H;y+=36){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.globalAlpha=1;
    // Center line
    const cy = H/2 - 30;
    ctx.strokeStyle='var(--qx-text-faint)'; ctx.lineWidth=1; ctx.globalAlpha=0.3;
    ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(W,cy);ctx.stroke();ctx.globalAlpha=1;

    // Target wave
    const tFn = waveFn({amp:target.amp,freq:target.freq,phase:target.phase,vShift:target.vShift+cy});
    ctx.beginPath();let first=true;
    for(let x=0;x<=W;x+=2){const y=tFn(x);first?(ctx.moveTo(x,y),first=false):ctx.lineTo(x,y);}
    ctx.strokeStyle='var(--qx-green)';ctx.lineWidth=3;ctx.globalAlpha=0.3;ctx.stroke();ctx.globalAlpha=1;

    // Player wave
    const pFn = waveFn({amp:params.amp,freq:params.freq,phase:params.phase,vShift:params.vShift+cy});
    ctx.beginPath();first=true;
    for(let x=0;x<=W;x+=2){const y=pFn(x);first?(ctx.moveTo(x,y),first=false):ctx.lineTo(x,y);}
    ctx.strokeStyle='var(--qx-accent)';ctx.lineWidth=2.5;
    ctx.shadowColor='var(--qx-accent)';ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;

    // Match glow
    if(matchPct>50){ctx.fillStyle=`color-mix(in srgb, var(--qx-green) ${(matchPct-50)/2}%, transparent)`;ctx.fillRect(0,0,W,H);}

    // HUD
    ctx.fillStyle=d?'#1C1A16':'#FCFBF8';ctx.fillRect(0,0,W,26);
    ctx.fillStyle='var(--qx-text-dim)';ctx.font='bold 9px var(--qx-font)';
    ctx.fillText(missionHUD,10,17);
    ctx.fillText(`MATCH: ${matchPct}%`,W/2-30,17);
    if(matchPct>=85){ctx.fillStyle='var(--qx-green)';ctx.fillText('◄ SPACE TO BREACH',W-160,17);}

    // Sliders
    const sy=H-110;ctx.fillStyle=d?'#1C1A16cc':'#FCFBF8cc';ctx.fillRect(0,sy,W,110);
    const labels={amp:'VOLUME',freq:'PITCH',phase:'H-SHIFT',vShift:'V-SHIFT'};
    const keysDisp={amp:'1/Q',freq:'2/W',phase:'3/E',vShift:'4/R'};
    const active=level.params;
    active.forEach((key,i)=>{
      const x=12+(W-24)*i/active.length,w=(W-24)/active.length-8;
      const val=params[key],maxV=key==='amp'?120:key==='freq'?5:key==='phase'?Math.PI*2:80,minV=key==='vShift'?-80:0;
      let dVal=tgt?.glitch?(key==='amp'?'A='+Math.round(val):key==='freq'?'ω='+val.toFixed(1):key==='phase'?'φ='+(val/Math.PI).toFixed(1)+'π':'D='+Math.round(val)):(key==='phase'?(val/Math.PI).toFixed(1)+'π':Math.round(val));
      ctx.fillStyle='var(--qx-text-dim)';ctx.font='bold 9px var(--qx-font)';
      ctx.fillText(labels[key]+' '+dVal,x,sy+18);
      ctx.fillStyle='var(--qx-border)';ctx.fillRect(x,sy+26,w,8);
      const pct=(val-minV)/(maxV-minV);
      ctx.fillStyle=matchPct>=85?'var(--qx-green)':'var(--qx-accent)';
      ctx.fillRect(x,sy+26,w*pct,8);
      ctx.fillStyle='var(--qx-text-faint)';ctx.font='8px var(--qx-font)';
      ctx.fillText(keysDisp[key],x,sy+52);
    });

    // Scanline
    scanLine=(scanLine+2)%H;ctx.fillStyle='color-mix(in srgb, var(--qx-accent) 3%, transparent)';ctx.fillRect(0,scanLine,W,1);

    // Glitch
    if(tgt?.glitch&&frame%28<5){ctx.fillStyle='color-mix(in srgb, var(--qx-accent) 5%, transparent)';
      for(let i=0;i<2;i++)ctx.fillRect(Math.random()*W,Math.random()*H,Math.random()*70,Math.random()*2);}

    // Success flash
    if(phase==='success'){ctx.fillStyle='color-mix(in srgb, var(--qx-green) 10%, transparent)';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='var(--qx-green-text)';ctx.font='bold 20px var(--qx-font)';ctx.textAlign='center';
      ctx.fillText('ACCESS GRANTED',W/2,H/2-20);ctx.textAlign='start';}
  }

  function loop(){frame++;if(phase!=='briefing'&&phase!=='reveal')draw();animFrame=requestAnimationFrame(loop);}

  onMount(()=>{
    ctx=canvasEl.getContext('2d');initLevel(0);
    animFrame=requestAnimationFrame(loop);
    window.addEventListener('keydown',handleKeydown);
    return ()=>{cancelAnimationFrame(animFrame);window.removeEventListener('keydown',handleKeydown);};
  });
</script>

<svelte:window on:keydown={handleKeydown}/>

<ArcadeShell eyebrow={config.eyebrow} title={config.title} level={score} totalLevels={level.targets.length} score={score*100} streak={score>2?score:0} onExit={onExit}>
  {#if phase==='briefing'}
    <div class="brief" in:fly={{x:reduceMotion?0:16,duration:reduceMotion?0:200}}>
      <h2>VAULT {levelIx+1} — {level.name}</h2>
      <p style="white-space:pre-line">{level.briefing}</p>
      <button class="primary" on:click={loadTarget}>Begin</button>
    </div>
  {:else if phase==='reveal'}
    <div class="reveal" in:fly={{x:reduceMotion?0:16,duration:reduceMotion?0:200}}>
      <div class="kicker">Decoded</div>
      <h2>{level.name}</h2>
      <p style="white-space:pre-line;color:var(--qx-green-text)">{level.reveal}</p>
      <p style="color:var(--qx-accent-text);font-weight:900">★ {score} frequencies cracked ★</p>
      {#if levelIx<2}
        <button class="primary" on:click={()=>initLevel(levelIx+1)}>Next vault</button>
      {:else}
        <div class="reveal-actions">
          <button class="primary" on:click={()=>{finishGame();onExit()}}>Return to workshops</button>
          <button class="secondary" on:click={restart}>Play again</button>
        </div>
      {/if}
    </div>
  {:else}
    <div class="game-area">
      <canvas bind:this={canvasEl} class="playfield" width={W} height={H}
        on:touchstart|preventDefault={touchStart} on:touchmove|preventDefault={touchMove} on:touchend={touchEnd}
        aria-label="Signal Hacker. Match the target waveform. Keyboard: 1/Q volume, 2/W pitch, 3/E phase, 4/R vertical. Space to breach.">
      </canvas>
    </div>
  {/if}
</ArcadeShell>

<style>
  .brief,.reveal,.game-area{display:flex;flex-direction:column;gap:10px;padding:0 4px}
  .brief,.reveal{align-items:center;text-align:center}
  .kicker{color:var(--qx-accent-text);font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase}
  h2{font-size:20px;line-height:1.15;margin:4px 0 6px;font-weight:950}
  p{color:var(--qx-text-dim);font-size:13px;line-height:1.5;margin:0}
  .playfield{width:100%;border:1px solid var(--qx-border);border-radius:14px;background:var(--qx-bg);touch-action:none}
  .primary,.secondary{min-height:46px;width:100%;border-radius:999px;font-family:var(--qx-font);font-size:14px;font-weight:900;cursor:pointer}
  .primary{border:none;background:var(--qx-accent);color:var(--qx-bg)}
  .secondary{border:1.5px solid var(--qx-border-2);background:var(--qx-surface);color:var(--qx-text-dim);margin-top:6px}
  .reveal-actions{width:100%;display:grid;gap:7px}
</style>
