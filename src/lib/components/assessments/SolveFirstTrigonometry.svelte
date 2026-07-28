<script>
  // Ramp Rider — Solve First trigonometry discovery arcade game.
  // Three missions teaching angle, hypotenuse, and trig ratios through
  // motorcycle stunt gameplay. Uses Qubix design tokens.
  import ArcadeShell from './ArcadeShell.svelte';
  import { fly } from 'svelte/transition';
  import { onMount, onDestroy } from 'svelte';

  export let config;
  export let onDone = () => {};
  export let onExit = () => {};

  const reduceMotion = typeof matchMedia !== 'undefined'
    && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const W = 360, H = 480;
  let canvasEl, ctx, animFrame;
  let recorded = false;

  // Game state
  let phase = 'briefing';  // briefing | aiming | flying | landed | reveal
  let levelIx = 0;
  let score = 0;
  let attempts = 0;
  let angle = 45;
  let bike = { x: 0, y: 0, vx: 0, vy: 0, alive: false, landed: false };
  let particles = [];
  let frameCount = 0;
  let shakeTimer = 0;
  let textFade = { msg: '', t: 0 };
  let boardTop = { x: 0, y: 0 };
  let dragging = false;
  let dragOff = { x: 0, y: 0 };

  // Level configs
  const LEVELS = [
    { // Level 1: The Angle
      name: 'The Angle', briefing: 'Tilt the ramp. Launch the bike. Clear the gap.\n\nFeel the angle before you name it.',
      gaps: [
        { rampX: 50, rampW: 44, rampH: 26, platX: 190, platW: 70, platY: 390, sol: 48, tol: 8 },
        { rampX: 45, rampW: 44, rampH: 26, platX: 230, platW: 62, platY: 370, sol: 56, tol: 7 },
        { rampX: 50, rampW: 44, rampH: 26, platX: 155, platW: 55, platY: 410, sol: 35, tol: 6 }
      ],
      reveal: 'You just used ANGLES.\n\nAn angle measures tilt from flat ground.\nSmall angle = shallow, long jump.\nLarge angle = high, short arc.'
    },
    { // Level 2: The Hypotenuse
      name: 'The Fixed Board', briefing: 'Only a FIXED-LENGTH board remains.\nDrag its top end — the length never changes.\nWhere must it reach?',
      boardLength: 140,
      gaps: [
        { anchorX: 80, anchorY: 440, platX: 210, platW: 60, platY: 370, solTop: { x: 200, y: 310 }, tol: 18 },
        { anchorX: 70, anchorY: 440, platX: 240, platW: 55, platY: 350, solTop: { x: 208, y: 315 }, tol: 16 }
      ],
      reveal: 'That board was the HYPOTENUSE.\n\nThe longest side of a right triangle.\nIts length is fixed — its slant determines\nreach (horizontal) and height (vertical).'
    },
    { // Level 3: The Boss
      name: 'The Decode', briefing: '⚠ SYSTEMS FAILING ⚠\n\nRaw data: SINE, COSINE.\nYou already know what these mean.',
      gaps: [
        { rampX: 50, rampW: 44, rampH: 26, platX: 210, platW: 62, platY: 380, sol: 50, tol: 6,
          glitch: true, hint: 'sin(θ) = height ÷ hypotenuse' },
        { rampX: 45, rampW: 44, rampH: 26, platX: 175, platW: 70, platY: 400, sol: 42, tol: 5,
          glitch: true, hint: 'cos(θ) = reach ÷ hypotenuse' }
      ],
      reveal: 'YOU ALREADY KNEW TRIG.\n\nSINE = how much of the ramp goes UP.\nCOSINE = how much goes ACROSS.\nThe angle controls both.'
    }
  ];

  let currentGap = 0;
  $: level = LEVELS[levelIx];
  $: gap = level.gaps[currentGap];
  $: missionLabel = `MISSION ${levelIx + 1} — ${level.name}`;

  // Init
  function initLevel(lvl) {
    levelIx = lvl; currentGap = 0; attempts = 0;
    bike = { x: 0, y: 0, vx: 0, vy: 0, alive: false, landed: false };
    particles = []; angle = 45; score = 0;
    phase = 'briefing';
    if (LEVELS[lvl].boardLength) {
      const g = LEVELS[lvl].gaps[0];
      boardTop = { x: g.anchorX + 80, y: g.anchorY - 120 };
    }
  }

  // Canvas rendering
  function drawGrid() {
    const gridAlpha = 0.08;
    ctx.strokeStyle = `color-mix(in srgb, var(--qx-border) ${gridAlpha*100}%, transparent)`;
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  }

  function drawRamp(x, y, w, h, a) {
    ctx.save(); ctx.translate(x + w, y); ctx.rotate(-a * Math.PI / 180);
    ctx.fillStyle = 'var(--qx-accent-soft)'; ctx.fillRect(-w, -h, w, h);
    ctx.strokeStyle = 'var(--qx-accent)'; ctx.lineWidth = 2.5; ctx.strokeRect(-w, -h, w, h);
    // Angle arc
    ctx.beginPath(); ctx.arc(0, 0, 22, -a * Math.PI / 180, 0);
    ctx.strokeStyle = 'var(--qx-yellow)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
  }

  function drawBoard(ax, ay, tx, ty) {
    const len = LEVELS[levelIx].boardLength;
    ctx.setLineDash([4, 8]); ctx.strokeStyle = 'color-mix(in srgb, var(--qx-accent) 20%, transparent)';
    ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(ax, ay, len, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = 'var(--qx-green)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.fillStyle = 'var(--qx-green)';
    ctx.beginPath(); ctx.arc(ax, ay, 5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(tx, ty, 7, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'var(--qx-text)'; ctx.font = '9px var(--qx-font)';
    ctx.fillText(len + 'px', (ax+tx)/2 - 16, (ay+ty)/2 - 10);
  }

  function drawPlatform(x, y, w) {
    ctx.fillStyle = 'var(--qx-green-soft)'; ctx.fillRect(x, y, w, 8);
    ctx.strokeStyle = 'var(--qx-green)'; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, 8);
    ctx.fillStyle = 'var(--qx-yellow)';
    ctx.fillRect(x + w/2 - 1, y - 14, 2, 14);
    ctx.beginPath(); ctx.moveTo(x + w/2, y - 14); ctx.lineTo(x + w/2 + 10, y - 9);
    ctx.lineTo(x + w/2, y - 4); ctx.fill();
  }

  function drawBike() {
    if (!bike.alive) return;
    ctx.save(); ctx.translate(bike.x, bike.y);
    const tilt = bike.alive && !bike.landed ? Math.atan2(bike.vy, bike.vx) * 0.25 : 0;
    ctx.rotate(tilt);
    ctx.fillStyle = 'var(--qx-accent)'; ctx.fillRect(-12, -5, 24, 8);
    ctx.fillStyle = 'var(--qx-green)';
    ctx.beginPath(); ctx.arc(-7, 6, 4.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(7, 6, 4.5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'var(--qx-yellow)';
    ctx.fillRect(-3, -13, 6, 10); ctx.fillRect(-1, -15, 2, 4);
    ctx.restore();
  }

  function drawParticles() {
    particles = particles.filter(p => { p.life--; return p.life > 0; });
    for (const p of particles) {
      const a = p.life / 30;
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x + p.vx*0.2, p.y + p.vy*0.2, 1.2, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // Background
    const isDark = document.documentElement.getAttribute('data-qx-theme') === 'dark';
    ctx.fillStyle = isDark ? '#141310' : '#F2EFE8'; ctx.fillRect(0, 0, W, H);
    drawGrid();

    if (!gap) return;

    if (level.boardLength) {
      drawBoard(gap.anchorX, gap.anchorY, boardTop.x, boardTop.y);
      drawPlatform(gap.platX, gap.platY, gap.platW);
    } else {
      drawRamp(gap.rampX, gap.platY, gap.rampW, gap.rampH, angle);
      drawPlatform(gap.platX, gap.platY, gap.platW);
    }

    // Bike on ramp before launch
    if (!bike.alive && phase === 'aiming' && !level.boardLength) {
      const rx = gap.rampX + gap.rampW - 8, ry = gap.platY - gap.rampH;
      ctx.fillStyle = 'var(--qx-accent)'; ctx.fillRect(rx-12, ry-7, 24, 8);
      ctx.fillStyle = 'var(--qx-green)';
      ctx.beginPath(); ctx.arc(rx-7, ry+4, 4.5, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(rx+7, ry+4, 4.5, 0, Math.PI*2); ctx.fill();
    }

    drawBike();
    drawParticles();

    // Angle display
    if (phase === 'aiming' && !level.boardLength) {
      ctx.fillStyle = 'var(--qx-accent)'; ctx.font = 'bold 26px var(--qx-font)';
      ctx.textAlign = 'center'; ctx.fillText(Math.round(angle) + '°', W/2, 75);
      ctx.textAlign = 'start';
      ctx.font = '10px var(--qx-font)'; ctx.fillStyle = 'var(--qx-text-faint)';
      ctx.textAlign = 'center'; ctx.fillText('← →  tilt ramp    SPACE  launch', W/2, 100);
      ctx.textAlign = 'start';
    }
    if (phase === 'aiming' && level.boardLength) {
      ctx.fillStyle = 'var(--qx-green)'; ctx.font = 'bold 12px var(--qx-font)';
      ctx.textAlign = 'center'; ctx.fillText('DRAG the board top    SPACE to launch', W/2, 65);
      ctx.textAlign = 'start';
    }

    // Text fade
    if (textFade.t < 1) {
      textFade.t += 0.015;
      const a = 1 - textFade.t;
      ctx.globalAlpha = Math.max(0, a);
      ctx.fillStyle = textFade.msg.includes('MISSED') ? 'var(--qx-danger)' : 'var(--qx-green)';
      ctx.font = 'bold 20px var(--qx-font)'; ctx.textAlign = 'center';
      ctx.fillText(textFade.msg, W/2, H/2 - 30); ctx.textAlign = 'start';
      ctx.globalAlpha = 1;
    }

    // Glitch effect
    if (gap.glitch && frameCount % 35 < 5) {
      ctx.fillStyle = 'color-mix(in srgb, var(--qx-accent) 6%, transparent)';
      ctx.fillRect(Math.random()*W, Math.random()*H, Math.random()*50, Math.random()*4);
    }
  }

  // Physics
  function launchBike() {
    if (phase !== 'aiming') return;
    phase = 'flying'; attempts++;
    if (level.boardLength) {
      const dx = gap.platX + gap.platW/2 - boardTop.x;
      const dy = gap.platY - boardTop.y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      const spd = 4.5;
      bike = { x: boardTop.x, y: boardTop.y, vx: (dx/dist)*spd, vy: (dy/dist)*spd - 1,
        alive: true, landed: false };
    } else {
      const rad = angle * Math.PI / 180, spd = 5;
      bike = { x: gap.rampX + gap.rampW - 8, y: gap.platY - gap.rampH,
        vx: Math.cos(rad)*spd, vy: -Math.sin(rad)*spd, alive: true, landed: false };
    }
  }

  function updatePhysics() {
    if (!bike.alive || bike.landed) return;
    bike.vy += 0.25;
    bike.x += bike.vx; bike.y += bike.vy;
    if (frameCount % 3 === 0) {
      particles.push({ x: bike.x, y: bike.y+4, vx: (Math.random()-0.5)*1.2, vy: (Math.random()-0.5)*1.2, life: 18, color: 'var(--qx-accent)' });
    }
    // Landing check
    if (bike.y >= gap.platY - 8 && bike.y <= gap.platY + 10 &&
        bike.x >= gap.platX && bike.x <= gap.platX + gap.platW) {
      bike.landed = true; bike.x = Math.max(gap.platX, Math.min(gap.platX+gap.platW, bike.x)); bike.y = gap.platY;
      onLand();
    }
    // Crash
    if (bike.y > H + 40 || bike.x < -40 || bike.x > W + 40) {
      bike.alive = false; bike.landed = false;
      textFade = { msg: 'MISSED — retry', t: 0 };
      shakeTimer = 8;
      setTimeout(() => { bike = { x:0,y:0,vx:0,vy:0,alive:false,landed:false }; particles=[]; phase='aiming'; }, 1000);
    }
  }

  function onLand() {
    score++;
    for (let i = 0; i < 16; i++) {
      particles.push({ x: bike.x, y: bike.y, vx: (Math.random()-0.5)*5, vy: (Math.random()-0.5)*5-2, life: 26, color: 'var(--qx-yellow)' });
    }
    textFade = { msg: 'LANDED!', t: 0 };
    phase = 'landed';
    if (currentGap < level.gaps.length - 1) {
      setTimeout(() => {
        currentGap++; bike = { x:0,y:0,vx:0,vy:0,alive:false,landed:false }; particles=[];
        phase = 'aiming';
        if (LEVELS[levelIx].boardLength) { const g = LEVELS[levelIx].gaps[currentGap]; boardTop = { x: g.anchorX+80, y: g.anchorY-120 }; }
      }, 1000);
    } else {
      setTimeout(() => { phase = 'reveal'; finishGame(); }, 1200);
    }
  }

  function finishGame() {
    if (recorded) return; recorded = true;
    onDone({ id: config.id, reward: Math.min(15, 6 + score*2 + (attempts <= level.gaps.length+1 ? 2 : 0)),
      arcadeScore: score * 100, levelsCleared: 3, perfectLevels: score >= level.gaps.length ? 3 : 2,
      patternFound: true, compared: true, transferFirstTry: attempts <= level.gaps.length+2, usedHint: false });
  }

  // Input
  function handleKeydown(e) {
    if (phase !== 'aiming' || level.boardLength) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') angle = Math.max(10, angle - 2);
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') angle = Math.min(80, angle + 2);
    if (e.key === ' ' || e.key === 'Enter') { launchBike(); e.preventDefault(); }
  }

  function canvasDown(e) {
    if (!level.boardLength || phase !== 'aiming') return;
    const rect = canvasEl.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top) * (H / rect.height);
    const dx = mx - boardTop.x, dy = my - boardTop.y;
    if (Math.sqrt(dx*dx+dy*dy) < 30) { dragging = true; dragOff = { x: dx, y: dy }; }
  }
  function canvasMove(e) {
    if (!dragging) return;
    const rect = canvasEl.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width) - dragOff.x;
    const my = (e.clientY - rect.top) * (H / rect.height) - dragOff.y;
    const dx = mx - gap.anchorX, dy = my - gap.anchorY;
    const dist = Math.sqrt(dx*dx+dy*dy);
    const scale = level.boardLength / Math.max(dist, 1);
    boardTop = { x: gap.anchorX + dx * scale, y: gap.anchorY + dy * scale };
  }
  function canvasUp() { dragging = false; }

  function restart() {
    initLevel(0); recorded = false; phase = 'briefing';
  }

  // Loop
  function loop() {
    frameCount++;
    if (phase === 'flying') updatePhysics();
    if (shakeTimer > 0) { shakeTimer *= 0.82; if (shakeTimer < 0.3) shakeTimer = 0; }
    draw();
    animFrame = requestAnimationFrame(loop);
  }

  onMount(() => {
    ctx = canvasEl.getContext('2d');
    initLevel(0);
    animFrame = requestAnimationFrame(loop);
    window.addEventListener('keydown', handleKeydown);
    return () => { cancelAnimationFrame(animFrame); window.removeEventListener('keydown', handleKeydown); };
  });
</script>

<svelte:window on:keydown={handleKeydown} />

<ArcadeShell eyebrow={config.eyebrow} title={config.title} level={score} totalLevels={level.gaps ? level.gaps.length * 3 : 7} score={score * 100} streak={score > 1 ? score : 0} onExit={onExit}>
  {#if phase === 'briefing'}
    <div class="brief" in:fly={{ x: reduceMotion ? 0 : 16, duration: reduceMotion ? 0 : 200 }}>
      <div class="portal-mark" aria-hidden="true">
        <span class="ramp-icon">∠</span>
      </div>
      <div class="kicker">{config.eyebrow}</div>
      <h2>{level.name}</h2>
      <p style="white-space:pre-line">{level.briefing}</p>
      <button class="primary" on:click={() => phase = 'aiming'}>Launch</button>
    </div>

  {:else if phase === 'reveal'}
    <div class="reveal" in:fly={{ x: reduceMotion ? 0 : 16, duration: reduceMotion ? 0 : 200 }}>
      <div class="kicker">The reasoning has a name</div>
      <h2>{level.name}</h2>
      <p style="white-space:pre-line;color:var(--qx-green-text)">{level.reveal}</p>
      <div class="reward-panel">
        <div class="reward-top">
          <div><span>Discovery distinction</span><strong>{config.rewardLabel}</strong></div>
        </div>
      </div>
      {#if levelIx < 2}
        <button class="primary" on:click={() => initLevel(levelIx + 1)}>Next mission</button>
      {:else}
        <div class="reveal-actions">
          <button class="primary" on:click={onExit}>Return to workshops</button>
          <button class="secondary" on:click={restart}>Play again</button>
        </div>
      {/if}
    </div>

  {:else}
    <div class="game-area">
      <div class="level-header">
        <span>{missionLabel} · Gap {currentGap + 1}/{level.gaps.length}</span>
        <strong>{level.name}</strong>
        {#if gap?.hint}<small style="color:var(--qx-text-faint)">{gap.hint}</small>{/if}
      </div>

      <canvas bind:this={canvasEl} class="playfield"
        width={W} height={H}
        on:pointerdown={canvasDown} on:pointermove={canvasMove} on:pointerup={canvasUp}
        on:touchstart|preventDefault={canvasDown}
        aria-label="Ramp Rider playfield. Use arrow keys to tilt the ramp, space to launch.">
      </canvas>
    </div>
  {/if}
</ArcadeShell>

<style>
  .brief, .reveal, .game-area { display: flex; flex-direction: column; gap: 10px; padding: 0 4px; }
  .brief, .reveal { align-items: center; text-align: center; }
  .portal-mark { width: 60px; height: 60px; margin: 8px 0 10px; display: flex; align-items: center; justify-content: center; }
  .ramp-icon { font-size: 48px; color: var(--qx-accent); }
  .kicker { color: var(--qx-accent); font-size: 10px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; }
  h2 { font-size: 20px; line-height: 1.15; margin: 4px 0 6px; font-weight: 950; }
  p { color: var(--qx-text-dim); font-size: 13px; line-height: 1.5; margin: 0; }
  .level-header { text-align: left; display: flex; flex-direction: column; gap: 2px; }
  .level-header span { color: var(--qx-accent-text); font-size: 9px; font-weight: 900; letter-spacing: 0.06em; text-transform: uppercase; }
  .level-header strong { font-size: 15px; }
  .playfield { width: 100%; border: 1px solid var(--qx-border); border-radius: 14px; background: var(--qx-bg); touch-action: none; }
  .primary, .secondary { min-height: 46px; width: 100%; border-radius: 999px; font-family: var(--qx-font); font-size: 14px; font-weight: 900; cursor: pointer; }
  .primary { border: none; background: var(--qx-accent); color: var(--qx-bg); }
  .secondary { border: 1.5px solid var(--qx-border-2); background: var(--qx-surface); color: var(--qx-text-dim); margin-top: 6px; }
  .reward-panel { width: 100%; box-sizing: border-box; border: 1.5px solid var(--qx-green); border-radius: 14px; background: var(--qx-green-soft); padding: 12px; text-align: left; }
  .reward-top { display: flex; justify-content: space-between; align-items: center; }
  .reward-top span { font-size: 9px; color: var(--qx-green-text); font-weight: 900; text-transform: uppercase; }
  .reward-top strong { font-size: 15px; }
  .reveal-actions { width: 100%; display: grid; gap: 7px; }
</style>
