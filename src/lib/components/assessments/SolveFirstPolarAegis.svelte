<script>
  // Polar Aegis — a Solve First polar-coordinates arcade (bullet-hell).
  //
  // Your shield IS the equation r = a·cos(k·θ). Grow it with a, morph it into
  // rose petals with k, and destroy the enemies it touches. The reveal decodes
  // the equation. The deliberate neon-on-black look is this game's own idiom.
  //
  // Rewritten 2026-07-29: the port had NO player controls at all (a and k were
  // frozen, despite the briefing promising both) — added slider + keyboard
  // control; checkBossHits() was never called, making the boss unkillable —
  // wired into the loop; the sim also ran during the briefing, leaking enemies
  // into an unstarted game — gated on phase; canvas now sizes to its container
  // instead of the window; reward is recorded (rounded) at the reveal.
  import ArcadeShell from './ArcadeShell.svelte';
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { playAward, playBonus } from '../../sfx.js';

  export let config;
  export let onDone = () => {};
  export let onExit = () => {};

  const reduceMotion = typeof matchMedia !== 'undefined'
    && matchMedia('(prefers-reduced-motion:reduce)').matches;

  let c, ctx, af, recorded = false, phase = 'briefing';
  let W = 380, H = 440, cx = W / 2, cy = H / 2;
  let frame = 0, dt = 0, lastTime = 0;
  let a = 110, kFold = 1;
  let enemies = [], particles = [], kills = 0, totalKills = 0, hullHits = 0;
  let shakeAmt = 0, shakeDur = 0;
  let levelState = 'LEVEL1', bossNodes = [], bossHP = 6, bossTimerVal = 20, levelTimer = 0;

  const GOALS = { LEVEL1: 25, LEVEL2: 50 };
  const LEVEL_LABEL = {
    LEVEL1: 'WAVE 1 — grow the shield (a)',
    LEVEL2: 'WAVE 2 — corridors: try resonance (k)',
    LEVEL3: 'WAVE 3 — survive 30s',
    BOSS: 'BOSS — shatter all 6 nodes'
  };

  // Predict-k gate: before the boss, the learner must read the equation.
  // Nodes sit at 30°, 90°, 150°, 210°, 270°, 330°. Petal tips of
  // r = a·|cos(kθ)| appear where k·θ is a multiple of 180°. k=6 puts a tip
  // on every node angle (6·30° = 180°); k=3 lands tips at 0°/60°/120° — all
  // BETWEEN the nodes.
  const PREDICT_K = {
    q: 'Boss nodes sit at 30°, 90°, 150°… every 60°. Petal tips form where k·θ hits a multiple of 180°. Which k puts a tip on every node?',
    options: [
      { label: 'k = 3 — six petals for six nodes', ok: false },
      { label: 'k = 6 — tips land every 30°', ok: true },
      { label: 'k = 8 — more petals, more coverage', ok: false }
    ],
    hint: 'Try it: 30° × 3 = 90° — not a multiple of 180°, so k=3 petals miss the nodes. 30° × 6 = 180° ✓. Petal count isn’t enough; ALIGNMENT is the equation.'
  };
  let predictTries = 0;
  let predictWrong = false;

  function answerPredictK(opt) {
    predictTries++;
    if (!opt.ok) { predictWrong = true; return; }
    playBonus();
    setLevel('BOSS');
    lastTime = performance.now();
    phase = 'playing';
  }

  function resize() {
    if (!c || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = c.parentElement.getBoundingClientRect();
    W = Math.max(300, Math.min(560, rect.width - 2));
    H = Math.max(360, Math.min(520, Math.round(W * 1.15)));
    c.width = W * dpr;
    c.height = H * dpr;
    c.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = W / 2;
    cy = H / 2;
  }

  function weaponRadius(theta) {
    return kFold === 1 ? a : Math.abs(a * Math.cos(kFold * theta));
  }

  function spawnEnemy(dist, theta) {
    return {
      x: cx + dist * Math.cos(theta),
      y: cy + dist * Math.sin(theta),
      speed: 1.6 + Math.random() * 1.6,
      r: 3 + Math.random() * 3
    };
  }

  function spawn(freq, corridors, spread) {
    if (frame % freq === 0) {
      const th = corridors
        ? corridors[Math.floor(Math.random() * corridors.length)] + (Math.random() - .5) * spread
        : Math.random() * Math.PI * 2;
      enemies.push(spawnEnemy(Math.max(W, H) * 0.72, th));
    }
  }

  function spawnParticles(x, y, n, color) {
    for (let i = 0; i < n; i++) {
      particles.push({
        x, y,
        vx: (Math.random() - .5) * 8, vy: (Math.random() - .5) * 8,
        life: 25 + Math.random() * 15,
        color: color || (Math.random() > .5 ? '#0ff' : '#f0f')
      });
    }
  }

  function checkHits() {
    const T = 14;
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      const dx = e.x - cx, dy = e.y - cy;
      const eR = Math.sqrt(dx * dx + dy * dy);
      const wR = weaponRadius(Math.atan2(dy, dx));
      if (Math.abs(eR - wR) < T + e.r) {
        spawnParticles(e.x, e.y, 8);
        enemies.splice(i, 1);
        kills++;
        totalKills++;
      } else if (eR < 12) {
        shakeAmt = 8;
        shakeDur = 12;
        hullHits++;
        enemies.splice(i, 1);
      }
    }
  }

  function checkBossHits() {
    for (const n of bossNodes) {
      if (!n.alive) continue;
      const dx = n.x - cx, dy = n.y - cy;
      const eR = Math.sqrt(dx * dx + dy * dy);
      const wR = weaponRadius(Math.atan2(dy, dx));
      if (Math.abs(eR - wR) < 20) {
        n.alive = false;
        bossHP--;
        playBonus();
        spawnParticles(n.x, n.y, 15, '#f0f');
      }
    }
    if (bossHP <= 0) {
      phase = 'reveal';
      finishGame();
    }
  }

  function setLevel(s) {
    enemies = [];
    kills = 0;
    levelTimer = 0;
    levelState = s;
    if (s === 'BOSS') {
      bossHP = 6;
      bossTimerVal = 20;
      bossNodes = [];
      const R = Math.min(cx, cy) * 0.78;
      for (let i = 0; i < 6; i++) {
        const th = i * Math.PI / 3 - Math.PI / 6;
        bossNodes.push({ x: cx + R * Math.cos(th), y: cy + R * Math.sin(th), alive: true, th, R });
      }
    }
  }

  function finishGame() {
    if (recorded) return;
    recorded = true;
    playAward();
    onDone({
      id: config.id,
      reward: Math.min(15, Math.round(8 + totalKills / 25)),
      arcadeScore: totalKills * 10,
      levelsCleared: 4,
      perfectLevels: hullHits === 0 ? 4 : 3,
      patternFound: true,
      compared: true,
      transferFirstTry: predictTries === 1,
      usedHint: predictTries > 1
    });
  }

  function start() {
    resize();
    totalKills = 0;
    hullHits = 0;
    a = 110;
    kFold = 1;
    particles = [];
    setLevel('LEVEL1');
    lastTime = performance.now();
    phase = 'playing';
  }

  function restart() {
    recorded = false;
    predictTries = 0;
    predictWrong = false;
    phase = 'briefing';
  }

  function handleKey(e) {
    if (phase !== 'playing') return;
    const k = e.key;
    let used = true;
    if (k === 'ArrowUp' || k === 'w') a = Math.min(240, a + 6);
    else if (k === 'ArrowDown' || k === 's') a = Math.max(40, a - 6);
    else if (k === 'ArrowLeft' || k === 'a') kFold = Math.max(1, kFold - 1);
    else if (k === 'ArrowRight' || k === 'd') kFold = Math.min(8, kFold + 1);
    else used = false;
    if (used) e.preventDefault();
  }

  function draw() {
    if (!ctx) return;
    // motion-trail fade
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(-20, -20, W + 40, H + 40);
    ctx.globalCompositeOperation = 'lighter';
    ctx.save();
    if (shakeDur > 0 && !reduceMotion) {
      ctx.translate((Math.random() - .5) * shakeAmt, (Math.random() - .5) * shakeAmt);
      shakeAmt *= .85;
      shakeDur--;
    }

    // the weapon curve r = a·cos(kθ)
    ctx.beginPath();
    if (kFold === 1) {
      ctx.arc(cx, cy, a, 0, Math.PI * 2);
    } else {
      let first = true;
      for (let th = 0; th <= Math.PI * 2 + 0.03; th += 0.03) {
        const r = Math.abs(a * Math.cos(kFold * th));
        const x = cx + r * Math.cos(th), y = cy + r * Math.sin(th);
        first ? (ctx.moveTo(x, y), first = false) : ctx.lineTo(x, y);
      }
    }
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#0ff';
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = .4;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // enemies
    for (const e of enemies) {
      const dx = e.x - cx, dy = e.y - cy;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      e.x -= (dx / d) * e.speed;
      e.y -= (dy / d) * e.speed;
      ctx.fillStyle = '#f44';
      ctx.shadowColor = '#f44';
      ctx.shadowBlur = 6;
      ctx.fillRect(e.x - e.r, e.y - e.r, e.r * 2, e.r * 2);
      ctx.shadowBlur = 0;
    }

    // particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      p.vx *= .92; p.vy *= .92;
      p.life--;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = p.life / 40;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
      ctx.globalAlpha = 1;
    }

    // boss nodes
    for (const n of bossNodes) {
      if (!n.alive) continue;
      ctx.strokeStyle = '#f0f';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#f0f';
      ctx.shadowBlur = 20;
      ctx.beginPath(); ctx.arc(n.x, n.y, 12, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#f0f';
      ctx.beginPath(); ctx.arc(n.x, n.y, 5, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }

    // core
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 20;
    ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
    ctx.globalCompositeOperation = 'source-over';

    // HUD
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, W, 24);
    ctx.fillStyle = '#0ff';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(LEVEL_LABEL[levelState], 8, 16);
    let right = '';
    if (levelState === 'LEVEL1' || levelState === 'LEVEL2') right = `KILLS ${kills}/${GOALS[levelState]}`;
    else if (levelState === 'LEVEL3') right = `SURVIVE ${Math.max(0, Math.ceil(30 - levelTimer))}s`;
    else right = `NODES ${6 - bossHP}/6 · ${Math.max(0, Math.ceil(bossTimerVal))}s`;
    ctx.fillText(right, W - ctx.measureText(right).width - 8, 16);
  }

  function loop(ts) {
    dt = (ts - lastTime) / 1000;
    lastTime = ts;
    if (dt > .1) dt = .1;
    frame++;
    if (phase === 'playing') {
      if (levelState === 'LEVEL1') {
        spawn(26, null, 0);
        checkHits();
        if (kills >= GOALS.LEVEL1) setLevel('LEVEL2');
      } else if (levelState === 'LEVEL2') {
        spawn(20, [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2], .15);
        checkHits();
        if (kills >= GOALS.LEVEL2) setLevel('LEVEL3');
      } else if (levelState === 'LEVEL3') {
        const wavePhase = Math.floor(frame / 300) % 2;
        const p = wavePhase === 0
          ? [0, 2 * Math.PI / 3, 4 * Math.PI / 3]
          : [0, 2 * Math.PI / 5, 4 * Math.PI / 5, 6 * Math.PI / 5, 8 * Math.PI / 5];
        spawn(14, p, .1);
        checkHits();
        levelTimer += dt;
        if (levelTimer >= 30) { predictWrong = false; phase = 'predict'; }
      } else if (levelState === 'BOSS') {
        spawn(40, null, 0);
        checkHits();
        checkBossHits();
        bossTimerVal -= dt;
        if (bossTimerVal <= 0 && phase === 'playing') phase = 'gameover';
      }
      if (c) draw();
    }
    af = requestAnimationFrame(loop);
  }

  onMount(() => {
    ctx = c.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    lastTime = performance.now();
    af = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(af);
      window.removeEventListener('resize', resize);
    };
  });
</script>

<svelte:window on:keydown={handleKey} />

<ArcadeShell
  eyebrow={config.eyebrow}
  title={config.title}
  level={levelState === 'LEVEL1' ? 1 : levelState === 'LEVEL2' ? 2 : levelState === 'LEVEL3' ? 3 : 4}
  totalLevels={4}
  score={totalKills * 10}
  streak={kills > 10 ? kills : 0}
  onExit={() => { if (phase === 'reveal') finishGame(); onExit(); }}
>
  <canvas
    bind:this={c}
    class="pf"
    class:hidden={phase === 'briefing' || phase === 'reveal' || phase === 'gameover' || phase === 'predict'}
    aria-label="Polar Aegis arena"
  ></canvas>

  {#if phase === 'playing'}
    <div class="controls">
      <label class="ctl">
        <span>Energy radius · a = {Math.round(a)}</span>
        <input type="range" min="40" max="240" step="2" bind:value={a} aria-label="Energy radius a" />
      </label>
      <label class="ctl">
        <span>Resonance · k = {kFold} {kFold === 1 ? '(circle)' : '(petals)'}</span>
        <input type="range" min="1" max="8" step="1" bind:value={kFold} aria-label="Resonance k" />
      </label>
    </div>
  {/if}

  {#if phase === 'briefing'}
    <div class="b" in:fly={{ x: reduceMotion ? 0 : 16, duration: reduceMotion ? 0 : 200 }}>
      <h2>Polar Aegis</h2>
      <p style="white-space:pre-line">{'Your weapon is a math equation.\n\n  ■ ENERGY RADIUS (a) — expands the shield\n  ■ RESONANCE (k) — morphs it into petals\n\nEnemies die where the curve touches them.\nMorph it. Master it. Decode it.'}</p>
      <button class="p" on:click={start}>▶ ACTIVATE</button>
    </div>
  {:else if phase === 'reveal'}
    <div class="r" in:fly={{ x: reduceMotion ? 0 : 16, duration: reduceMotion ? 0 : 200 }}>
      <div class="k">Decoded</div>
      <h2>Weapon Mastered</h2>
      <p style="white-space:pre-line;color:var(--qx-green-text)">{'r = a · cos(k · θ)\n\na = radius (size)\nk = resonance (petal count)\n\nEvery point of that shield was a\ndistance r at an angle θ — polar\ncoordinates, wielded live.'}</p>
      <p style="color:var(--qx-accent-text);font-weight:900">★ {totalKills} enemies destroyed ★</p>
      <div class="ra">
        <button class="p" on:click={() => { finishGame(); onExit(); }}>Return to workshops</button>
        <button class="s" on:click={restart}>Play again</button>
      </div>
    </div>
  {:else if phase === 'predict'}
    <div class="r" in:fly={{ x: reduceMotion ? 0 : 16, duration: reduceMotion ? 0 : 200 }}>
      <div class="k">Boss approach — read the equation first</div>
      <h2>r = a · cos(k · θ)</h2>
      <p>{PREDICT_K.q}</p>
      <div class="topts">
        {#each PREDICT_K.options as opt (opt.label)}
          <button class="topt" on:click={() => answerPredictK(opt)}>{opt.label}</button>
        {/each}
      </div>
      {#if predictWrong}<p class="twrong">{PREDICT_K.hint}</p>{/if}
    </div>

  {:else if phase === 'gameover'}
    <div class="r" in:fly={{ x: reduceMotion ? 0 : 16, duration: reduceMotion ? 0 : 200 }}>
      <h2>System Failure</h2>
      <p>The boss nodes outlasted the timer.</p>
      <p style="color:var(--qx-accent-text);font-weight:900">Kills: {totalKills}</p>
      <button class="p" on:click={restart}>Retry</button>
    </div>
  {/if}
</ArcadeShell>

<style>
  .b, .r { display: flex; flex-direction: column; gap: 10px; padding: 0 4px; align-items: center; text-align: center; }
  .k { color: var(--qx-accent-text); font-size: 10px; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
  h2 { font-size: 20px; line-height: 1.15; margin: 4px 0 6px; font-weight: 950; }
  p { color: var(--qx-text-dim); font-size: 13px; line-height: 1.5; margin: 0; }
  .pf { width: 100%; border: 1px solid var(--qx-border); border-radius: 14px; background: #000; touch-action: none; }
  .pf.hidden { display: none; }
  .controls { display: grid; gap: 7px; margin-top: 10px; grid-template-columns: 1fr 1fr; }
  .ctl { display: grid; gap: 3px; }
  .ctl span { color: var(--qx-text-dim); font-size: 10px; font-weight: 900; letter-spacing: .06em; text-transform: uppercase; font-variant-numeric: tabular-nums; }
  .ctl input { width: 100%; accent-color: var(--qx-accent); min-height: 28px; }
  .p, .s { min-height: 46px; width: 100%; border-radius: 999px; font-family: var(--qx-font); font-size: 14px; font-weight: 900; cursor: pointer; }
  .p { border: none; background: var(--qx-accent); color: var(--qx-bg); }
  .s { border: 1.5px solid var(--qx-border-2); background: var(--qx-surface); color: var(--qx-text-dim); margin-top: 6px; }
  .ra { width: 100%; display: grid; gap: 7px; }
  .topts { width: 100%; display: grid; gap: 8px; }
  .topt { border: 1.5px solid var(--qx-border-2); border-radius: 12px; background: var(--qx-surface); color: var(--qx-text); font-family: var(--qx-font); font-size: 13px; font-weight: 750; min-height: 46px; padding: 8px 14px; cursor: pointer; text-align: left; }
  .topt:hover { border-color: var(--qx-accent); }
  .twrong { color: var(--qx-danger-text); font-size: 12.5px; font-weight: 700; }
</style>
