<script>
  // Ramp Rider — a Solve First trigonometry arcade.
  //
  // Level 1: tilt a ramp, launch a bike, feel ANGLE.
  // Level 2: drag a fixed-length board — the HYPOTENUSE — to reach a platform.
  // Level 3: labels glitch out; the reveal names sine and cosine.
  //
  // Rewritten 2026-07-29: canvas colors resolved from Qubix tokens (canvas
  // ignores var()/color-mix), touch controls added (angle slider + launch
  // button), level 2 made launchable (it previously had no launch path at
  // all), duplicate keydown listener removed, and the discovery reward is now
  // actually recorded when the final reveal is reached.
  import ArcadeShell from './ArcadeShell.svelte';
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { resolvePalette, watchTheme, withAlpha } from './arcadePalette.js';
  import { playAward } from '../../sfx.js';

  export let config;
  export let onDone = () => {};
  export let onExit = () => {};

  const reduceMotion = typeof matchMedia !== 'undefined'
    && matchMedia('(prefers-reduced-motion:reduce)').matches;

  const W = 360, H = 480;
  let c, ctx, af, recorded = false;
  let P = null; // resolved palette

  let phase = 'briefing', levelIx = 0, score = 0, attempts = 0, frame = 0, angle = 45;
  let bike = { x: 0, y: 0, vx: 0, vy: 0, alive: false, landed: false };
  let particles = [], shakeTimer = 0, textFade = { msg: '', t: 1 };
  let boardTop = { x: 0, y: 0 }, dragging = false, dragOff = { x: 0, y: 0 };
  let currentTarget = 0;
  let totalLandings = 0, totalAttempts = 0;

  const LEVELS = [
    {
      name: 'The Angle',
      briefing: 'Tilt the ramp. Launch the bike. Clear the gap.\n\nFeel the angle before you name it.',
      gaps: [
        { rampX: 50, rampW: 44, rampH: 26, platX: 190, platW: 70, platY: 390, sol: 48, tol: 8 },
        { rampX: 45, rampW: 44, rampH: 26, platX: 230, platW: 62, platY: 370, sol: 56, tol: 7 },
        { rampX: 50, rampW: 44, rampH: 26, platX: 155, platW: 55, platY: 410, sol: 35, tol: 6 }
      ],
      reveal: 'You just used ANGLES.\n\nAn angle measures tilt from flat ground.\nSmall angle = shallow, long jump.\nLarge angle = high, short arc.'
    },
    {
      name: 'The Fixed Board',
      briefing: 'Only a FIXED-LENGTH board remains.\nDrag its top end — the length never changes.\nWhere must it reach?',
      boardLength: 140,
      gaps: [
        { anchorX: 80, anchorY: 440, platX: 210, platW: 60, platY: 370, tol: 18 },
        { anchorX: 70, anchorY: 440, platX: 240, platW: 55, platY: 350, tol: 16 }
      ],
      reveal: 'That board was the HYPOTENUSE.\n\nThe longest side of a right triangle.\nIts length is fixed — its slant determines\nreach (horizontal) and height (vertical).'
    },
    {
      name: 'The Decode',
      briefing: '⚠ SYSTEMS FAILING ⚠\n\nRaw data: SINE, COSINE.\nYou already know what these mean.',
      gaps: [
        { rampX: 50, rampW: 44, rampH: 26, platX: 210, platW: 62, platY: 380, sol: 50, tol: 6, glitch: true },
        { rampX: 45, rampW: 44, rampH: 26, platX: 175, platW: 70, platY: 400, sol: 42, tol: 5, glitch: true }
      ],
      reveal: 'YOU ALREADY KNEW TRIG.\n\nSINE = how much of the ramp goes UP.\nCOSINE = how much goes ACROSS.\nThe angle controls both.'
    }
  ];

  $: lv = LEVELS[levelIx];
  $: gap = lv.gaps?.[currentTarget] || null;
  $: canLaunch = phase === 'aiming';

  // Final check — call the angle from a described gap, no launch to lean on.
  const QUIZ = {
    q: 'Last stunt, no test run. The platform is CLOSE to the ramp but HIGH above it. Which launch angle?',
    options: [
      { label: '20° — fast and flat', ok: false },
      { label: '45° — the all-rounder', ok: false },
      { label: '70° — steep and tall', ok: true }
    ],
    hint: 'Steep angles trade distance for height: sine (up) grows, cosine (across) shrinks. Close-but-high wants a big angle.'
  };
  let quizTries = 0;
  let quizWrong = false;

  function answerQuiz(opt) {
    quizTries++;
    if (!opt.ok) { quizWrong = true; return; }
    enterReveal();
  }

  function initLevel(l) {
    levelIx = l;
    currentTarget = 0;
    attempts = 0;
    bike = { x: 0, y: 0, vx: 0, vy: 0, alive: false, landed: false };
    particles = [];
    angle = 45;
    score = 0;
    phase = 'briefing';
    if (LEVELS[l].boardLength) {
      const g = LEVELS[l].gaps[0];
      boardTop = { x: g.anchorX + 80, y: g.anchorY - 120 };
    }
  }

  function launchBike() {
    if (phase !== 'aiming') return;
    phase = 'flying';
    attempts++;
    totalAttempts++;
    if (lv.boardLength) {
      const dx = gap.platX + gap.platW / 2 - boardTop.x;
      const dy = gap.platY - boardTop.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const spd = 4.5;
      bike = { x: boardTop.x, y: boardTop.y, vx: (dx / dist) * spd, vy: (dy / dist) * spd - 1, alive: true, landed: false };
    } else {
      const rad = angle * Math.PI / 180, spd = 5;
      bike = { x: gap.rampX + gap.rampW - 8, y: gap.platY - gap.rampH, vx: Math.cos(rad) * spd, vy: -Math.sin(rad) * spd, alive: true, landed: false };
    }
  }

  function updatePhysics() {
    if (!bike.alive || bike.landed) return;
    bike.vy += 0.25;
    bike.x += bike.vx;
    bike.y += bike.vy;
    if (frame % 3 === 0 && P) {
      particles.push({ x: bike.x, y: bike.y + 4, vx: (Math.random() - .5) * 1.2, vy: (Math.random() - .5) * 1.2, life: 18, color: P.accent });
    }
    if (bike.y >= gap.platY - 8 && bike.y <= gap.platY + 10 && bike.x >= gap.platX && bike.x <= gap.platX + gap.platW) {
      bike.landed = true;
      bike.x = Math.max(gap.platX, Math.min(gap.platX + gap.platW, bike.x));
      bike.y = gap.platY;
      onLand();
    }
    if (bike.y > H + 40 || bike.x < -40 || bike.x > W + 40) {
      bike.alive = false;
      bike.landed = false;
      textFade = { msg: 'MISSED — retry', t: 0 };
      shakeTimer = 8;
      setTimeout(() => {
        bike = { x: 0, y: 0, vx: 0, vy: 0, alive: false, landed: false };
        particles = [];
        phase = 'aiming';
      }, 900);
    }
  }

  function onLand() {
    score++;
    totalLandings++;
    if (P) {
      for (let i = 0; i < 16; i++) {
        particles.push({ x: bike.x, y: bike.y, vx: (Math.random() - .5) * 5, vy: (Math.random() - .5) * 5 - 2, life: 26, color: P.yellow });
      }
    }
    textFade = { msg: 'LANDED!', t: 0 };
    phase = 'landed';
    if (currentTarget < lv.gaps.length - 1) {
      setTimeout(() => {
        currentTarget++;
        bike = { x: 0, y: 0, vx: 0, vy: 0, alive: false, landed: false };
        particles = [];
        phase = 'aiming';
        if (LEVELS[levelIx].boardLength) {
          const g = LEVELS[levelIx].gaps[currentTarget];
          boardTop = { x: g.anchorX + 80, y: g.anchorY - 120 };
        }
      }, 900);
    } else if (levelIx === LEVELS.length - 1) {
      setTimeout(() => { quizWrong = false; phase = 'quiz'; }, 1100);
    } else {
      setTimeout(() => { enterReveal(); }, 1100);
    }
  }

  function enterReveal() {
    phase = 'reveal';
    if (levelIx === LEVELS.length - 1) finishGame();
  }

  function finishGame() {
    if (recorded) return;
    recorded = true;
    playAward();
    const totalGaps = LEVELS.reduce((n, l) => n + l.gaps.length, 0);
    onDone({
      id: config.id,
      reward: Math.min(15, 6 + totalLandings + (totalAttempts <= totalGaps + 2 ? 2 : 0)),
      arcadeScore: totalLandings * 100,
      levelsCleared: 3,
      perfectLevels: totalAttempts <= totalGaps ? 3 : 2,
      patternFound: true,
      compared: true,
      transferFirstTry: quizTries === 1,
      usedHint: quizTries > 1
    });
  }

  function restart() {
    recorded = false;
    totalLandings = 0;
    totalAttempts = 0;
    quizTries = 0;
    quizWrong = false;
    initLevel(0);
  }

  function handleKey(e) {
    if (phase !== 'aiming') return;
    if (!lv.boardLength) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { angle = Math.max(10, angle - 2); e.preventDefault(); }
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { angle = Math.min(80, angle + 2); e.preventDefault(); }
    }
    if (e.key === ' ' || e.key === 'Enter') { launchBike(); e.preventDefault(); }
  }

  function toCanvas(e) {
    const rect = c.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (W / rect.width),
      y: (e.clientY - rect.top) * (H / rect.height)
    };
  }

  function canvasDown(e) {
    if (!lv.boardLength || phase !== 'aiming') return;
    const m = toCanvas(e);
    const dx = m.x - boardTop.x, dy = m.y - boardTop.y;
    if (Math.sqrt(dx * dx + dy * dy) < 44) {
      dragging = true;
      dragOff = { x: dx, y: dy };
      c.setPointerCapture?.(e.pointerId);
    }
  }

  function canvasMove(e) {
    if (!dragging) return;
    const m = toCanvas(e);
    const mx = m.x - dragOff.x, my = m.y - dragOff.y;
    const dx = mx - gap.anchorX, dy = my - gap.anchorY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const scale = lv.boardLength / Math.max(dist, 1);
    boardTop = { x: gap.anchorX + dx * scale, y: gap.anchorY + dy * scale };
  }

  function canvasUp() { dragging = false; }

  function draw() {
    if (!ctx || !P) return;
    ctx.fillStyle = P.bg;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = P.border;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3;
    for (let x = 0; x < W; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.globalAlpha = 1;
    if (!gap) return;

    if (lv.boardLength) {
      // reach circle
      ctx.setLineDash([4, 8]);
      ctx.strokeStyle = withAlpha(P.accent, 0.2);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(gap.anchorX, gap.anchorY, lv.boardLength, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      // the right-triangle legs the board implies
      ctx.strokeStyle = withAlpha(P.green, 0.35);
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(gap.anchorX, gap.anchorY);
      ctx.lineTo(boardTop.x, gap.anchorY);
      ctx.lineTo(boardTop.x, boardTop.y);
      ctx.stroke();
      ctx.setLineDash([]);
      // the board (hypotenuse)
      ctx.strokeStyle = P.green;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(gap.anchorX, gap.anchorY);
      ctx.lineTo(boardTop.x, boardTop.y);
      ctx.stroke();
      ctx.fillStyle = P.green;
      ctx.beginPath(); ctx.arc(gap.anchorX, gap.anchorY, 5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(boardTop.x, boardTop.y, 8, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = withAlpha(P.green, 0.5);
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(boardTop.x, boardTop.y, 13, 0, Math.PI * 2); ctx.stroke();
    } else {
      ctx.save();
      ctx.translate(gap.rampX + gap.rampW, gap.platY);
      ctx.rotate(-angle * Math.PI / 180);
      ctx.fillStyle = withAlpha(P.accent, 0.18);
      ctx.fillRect(-gap.rampW, -gap.rampH, gap.rampW, gap.rampH);
      ctx.strokeStyle = P.accent;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(-gap.rampW, -gap.rampH, gap.rampW, gap.rampH);
      ctx.restore();
      // angle arc at the ramp base
      ctx.strokeStyle = P.yellow;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(gap.rampX + gap.rampW, gap.platY, 22, -angle * Math.PI / 180, 0);
      ctx.stroke();
    }

    // platform + flag
    ctx.fillStyle = withAlpha(P.green, 0.18);
    ctx.fillRect(gap.platX, gap.platY, gap.platW, 8);
    ctx.strokeStyle = P.green;
    ctx.lineWidth = 2;
    ctx.strokeRect(gap.platX, gap.platY, gap.platW, 8);
    ctx.fillStyle = P.yellow;
    ctx.fillRect(gap.platX + gap.platW / 2 - 1, gap.platY - 14, 2, 14);
    ctx.beginPath();
    ctx.moveTo(gap.platX + gap.platW / 2, gap.platY - 14);
    ctx.lineTo(gap.platX + gap.platW / 2 + 10, gap.platY - 9);
    ctx.lineTo(gap.platX + gap.platW / 2, gap.platY - 4);
    ctx.fill();

    // bike
    const drawBike = (bx, by, tilt) => {
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(tilt);
      ctx.fillStyle = P.accent;
      ctx.fillRect(-12, -5, 24, 8);
      ctx.fillStyle = P.green;
      ctx.beginPath(); ctx.arc(-7, 6, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(7, 6, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = P.yellow;
      ctx.fillRect(-3, -13, 6, 10);
      ctx.fillRect(-1, -15, 2, 4);
      ctx.restore();
    };
    if (bike.alive) {
      drawBike(bike.x, bike.y, bike.landed ? 0 : Math.atan2(bike.vy, bike.vx) * 0.25);
    } else if (phase === 'aiming') {
      if (lv.boardLength) drawBike(boardTop.x, boardTop.y - 10, 0);
      else drawBike(gap.rampX + gap.rampW - 8, gap.platY - gap.rampH - 2, -angle * Math.PI / 180 * 0.5);
    }

    // particles
    particles = particles.filter((p) => { p.life--; return p.life > 0; });
    for (const p of particles) {
      ctx.globalAlpha = p.life / 30;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x += p.vx * 0.4, p.y += p.vy * 0.4, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // HUD text
    ctx.textAlign = 'center';
    if (phase === 'aiming' && !lv.boardLength) {
      ctx.fillStyle = P.accent;
      ctx.font = `bold 26px ${P.font}`;
      ctx.fillText(Math.round(angle) + '°', W / 2, 75);
    }
    if (phase === 'aiming' && lv.boardLength) {
      ctx.fillStyle = P.green;
      ctx.font = `bold 12px ${P.font}`;
      ctx.fillText('DRAG the glowing end, then LAUNCH', W / 2, 65);
    }
    if (textFade.t < 1) {
      textFade.t += 0.015;
      ctx.globalAlpha = Math.max(0, 1 - textFade.t);
      ctx.fillStyle = textFade.msg.includes('MISSED') ? P.danger : P.green;
      ctx.font = `bold 20px ${P.font}`;
      ctx.fillText(textFade.msg, W / 2, H / 2 - 30);
      ctx.globalAlpha = 1;
    }
    ctx.textAlign = 'start';

    if (gap.glitch && frame % 35 < 5) {
      ctx.fillStyle = withAlpha(P.accent, 0.06);
      ctx.fillRect(Math.random() * W, Math.random() * H, Math.random() * 50, Math.random() * 4);
    }
  }

  function loop() {
    frame++;
    if (phase === 'flying') updatePhysics();
    if (shakeTimer > 0) { shakeTimer *= .82; if (shakeTimer < 0.3) shakeTimer = 0; }
    if (phase !== 'briefing' && phase !== 'reveal' && c) draw();
    af = requestAnimationFrame(loop);
  }

  onMount(() => {
    ctx = c.getContext('2d');
    P = resolvePalette();
    const unwatch = watchTheme((next) => { P = next; });
    initLevel(0);
    af = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(af); unwatch(); };
  });
</script>

<svelte:window on:keydown={handleKey} />

<ArcadeShell
  eyebrow={config.eyebrow}
  title={config.title}
  level={levelIx + (phase === 'reveal' ? 1 : 0)}
  totalLevels={LEVELS.length}
  score={totalLandings * 100}
  streak={score > 1 ? score : 0}
  onExit={() => { if (phase === 'reveal' && levelIx === LEVELS.length - 1) finishGame(); onExit(); }}
>
  <canvas
    bind:this={c}
    class="pf"
    class:hidden={phase === 'briefing' || phase === 'reveal' || phase === 'quiz'}
    width={W}
    height={H}
    on:pointerdown={canvasDown}
    on:pointermove={canvasMove}
    on:pointerup={canvasUp}
    on:pointercancel={canvasUp}
    aria-label="Ramp Rider playfield"
  ></canvas>

  {#if phase !== 'briefing' && phase !== 'reveal' && phase !== 'quiz'}
    <div class="controls">
      {#if !lv.boardLength}
        <label class="ctl">
          <span>Ramp angle · {Math.round(angle)}&deg;</span>
          <input
            type="range" min="10" max="80" step="1"
            bind:value={angle}
            disabled={phase !== 'aiming'}
            aria-label="Ramp angle in degrees"
          />
        </label>
      {/if}
      <button class="launch" on:click={launchBike} disabled={!canLaunch}>
        {phase === 'flying' ? 'IN FLIGHT…' : 'LAUNCH ▸'}
      </button>
    </div>
  {/if}

  {#if phase === 'briefing'}
    <div class="b" in:fly={{ x: reduceMotion ? 0 : 16, duration: reduceMotion ? 0 : 200 }}>
      <h2>{lv.name}</h2>
      <p style="white-space:pre-line">{lv.briefing}</p>
      <button class="p" on:click={() => phase = 'aiming'}>Start mission</button>
    </div>
  {:else if phase === 'quiz'}
    <div class="r" in:fly={{ x: reduceMotion ? 0 : 16, duration: reduceMotion ? 0 : 200 }}>
      <div class="k">Final check — call it first</div>
      <h2>No test run.</h2>
      <p>{QUIZ.q}</p>
      <div class="topts">
        {#each QUIZ.options as opt (opt.label)}
          <button class="topt" on:click={() => answerQuiz(opt)}>{opt.label}</button>
        {/each}
      </div>
      {#if quizWrong}<p class="twrong">{QUIZ.hint}</p>{/if}
    </div>
  {:else if phase === 'reveal'}
    <div class="r" in:fly={{ x: reduceMotion ? 0 : 16, duration: reduceMotion ? 0 : 200 }}>
      <div class="k">Decoded</div>
      <h2>{lv.name}</h2>
      <p style="white-space:pre-line;color:var(--qx-green-text)">{lv.reveal}</p>
      <div class="rp"><div><span>Discovery</span><strong>{config.rewardLabel}</strong></div></div>
      {#if levelIx < LEVELS.length - 1}
        <button class="p" on:click={() => initLevel(levelIx + 1)}>Next mission</button>
      {:else}
        <div class="ra">
          <button class="p" on:click={() => { finishGame(); onExit(); }}>Return to workshops</button>
          <button class="s" on:click={restart}>Play again</button>
        </div>
      {/if}
    </div>
  {/if}
</ArcadeShell>

<style>
  .b, .r { display: flex; flex-direction: column; gap: 10px; padding: 0 4px; align-items: center; text-align: center; }
  .k { color: var(--qx-accent-text); font-size: 10px; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
  h2 { font-size: 20px; line-height: 1.15; margin: 4px 0 6px; font-weight: 950; }
  p { color: var(--qx-text-dim); font-size: 13px; line-height: 1.5; margin: 0; }
  .pf { width: 100%; border: 1px solid var(--qx-border); border-radius: 14px; background: var(--qx-bg); touch-action: none; }
  .pf.hidden { display: none; }
  .controls { display: grid; gap: 8px; margin-top: 10px; }
  .ctl { display: grid; gap: 4px; }
  .ctl span { color: var(--qx-text-dim); font-size: 10px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
  .ctl input { width: 100%; accent-color: var(--qx-accent); min-height: 28px; }
  .launch { min-height: 46px; border: none; border-radius: 999px; background: var(--qx-accent); color: var(--qx-bg); font: 900 14px var(--qx-font); cursor: pointer; }
  .launch:disabled { opacity: .45; cursor: default; }
  .p, .s { min-height: 46px; width: 100%; border-radius: 999px; font-family: var(--qx-font); font-size: 14px; font-weight: 900; cursor: pointer; }
  .p { border: none; background: var(--qx-accent); color: var(--qx-bg); }
  .s { border: 1.5px solid var(--qx-border-2); background: var(--qx-surface); color: var(--qx-text-dim); margin-top: 6px; }
  .ra { width: 100%; display: grid; gap: 7px; }
  .topts { width: 100%; display: grid; gap: 8px; }
  .topt { border: 1.5px solid var(--qx-border-2); border-radius: 12px; background: var(--qx-surface); color: var(--qx-text); font-family: var(--qx-font); font-size: 13px; font-weight: 750; min-height: 46px; padding: 8px 14px; cursor: pointer; text-align: left; }
  .topt:hover { border-color: var(--qx-accent); }
  .twrong { color: var(--qx-danger-text); font-size: 12.5px; font-weight: 700; }
  .rp { width: 100%; border: 1.5px solid var(--qx-green); border-radius: 14px; background: var(--qx-green-soft); padding: 12px; text-align: left; }
  .rp span { font-size: 9px; color: var(--qx-green-text); font-weight: 900; text-transform: uppercase; }
  .rp strong { font-size: 15px; }
</style>
