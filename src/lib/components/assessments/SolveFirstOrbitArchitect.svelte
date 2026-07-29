<script>
  // Orbit Architect — a Solve First conic-sections arcade.
  //
  // Stretch and slide an elliptical forcefield to capture drifting debris.
  // Only the final level names it: (x−h)²/a² + (y−k)²/b² = 1.
  //
  // Rewritten 2026-07-29: canvas colors resolved from Qubix tokens (canvas
  // ignores var()/color-mix), touch sliders added (it was keyboard-only),
  // duplicate keydown listener removed, capture checks now run continuously
  // (debris drifts, so it could previously drift inside the field unnoticed
  // between keypresses), and the discovery is recorded at the final reveal.
  //
  // Pedagogy pass: a FIELD ENERGY budget caps a·b, so maxing both radii can
  // no longer trivially swallow the whole field — eccentric shapes and centre
  // shifts become necessary, which is the point. Level-1 debris now sits in
  // axis-biased spots so stretching (a ≠ b) is the winning move. Before the
  // reveal, a transfer beat asks the learner to READ a standard-form equation
  // and predict which debris its field captures.
  import ArcadeShell from './ArcadeShell.svelte';
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { resolvePalette, watchTheme, withAlpha } from './arcadePalette.js';
  import { playAward, playBonus } from '../../sfx.js';

  export let config;
  export let onDone = () => {};
  export let onExit = () => {};

  const reduceMotion = typeof matchMedia !== 'undefined'
    && matchMedia('(prefers-reduced-motion:reduce)').matches;

  const W = 380, H = 400, CX = W / 2, CY = H / 2;
  let c, ctx, af, recorded = false;
  let P = null;

  let phase = 'briefing', levelIx = 0, score = 0, frame = 0;
  let params = { a: 80, b: 80, h: 0, k: 0 };
  let debris = [], debrisSet = null, currentTarget = 0, captured = 0;
  let stars = [];
  for (let i = 0; i < 80; i++) {
    stars.push({ x: Math.random() * W, y: Math.random() * H, r: .4 + Math.random() * 1.2, b: .15 + Math.random() * .45 });
  }

  const RANGES = {
    a: { min: 20, max: 180, step: 2 },
    b: { min: 20, max: 180, step: 2 },
    h: { min: -160, max: 160, step: 2 },
    k: { min: -160, max: 160, step: 2 }
  };
  const LABELS = { a: 'H-radius', b: 'V-radius', h: 'X-center', k: 'Y-center' };
  const RAW_LABELS = { a: 'a', b: 'b', h: 'h', k: 'k' };

  // FIELD ENERGY: the field's area cost is a·b. A circle big enough to swallow
  // the whole arena costs ~17,000+ — far over budget. Stretching reaches far
  // debris cheaply; shifting the centre costs nothing.
  const BUDGET = 8000;
  $: energyUsed = Math.round(params.a * params.b);
  $: energyPct = Math.min(100, Math.round((energyUsed / BUDGET) * 100));

  function clampBudget(changed) {
    // keep a·b ≤ BUDGET by pulling the OTHER radius down
    if (params.a * params.b <= BUDGET) return;
    if (changed === 'a') params.b = Math.max(RANGES.b.min, Math.floor(BUDGET / params.a));
    else params.a = Math.max(RANGES.a.min, Math.floor(BUDGET / params.b));
  }

  // Transfer beat: read the equation, predict the captures.
  // Field: (x−90)²/120² + y²/30² = 1  → h=90, k=0, a=120, b=30
  const TRANSFER_FIELD = { h: 90, k: 0, a: 120, b: 30 };
  const TRANSFER_DEBRIS = [
    { id: 'A', x: 150, y: 10 },   // inside
    { id: 'B', x: 90, y: -25 },   // inside
    { id: 'C', x: -40, y: 5 },    // outside (left of the shifted field)
    { id: 'D', x: 100, y: 80 }    // outside (too high for b=30)
  ];
  let transferPicks = new Set();
  let transferTries = 0;
  let transferMsg = '';

  function inTransferField(d) {
    const f = TRANSFER_FIELD;
    return ((d.x - f.h) / f.a) ** 2 + ((d.y - f.k) / f.b) ** 2 <= 1;
  }
  const TRANSFER_ANSWER = TRANSFER_DEBRIS.filter(inTransferField).map((d) => d.id).sort();

  function togglePick(id) {
    if (transferPicks.has(id)) transferPicks.delete(id);
    else transferPicks.add(id);
    transferPicks = transferPicks; // trigger reactivity
  }

  function submitTransfer() {
    transferTries++;
    const picked = [...transferPicks].sort().join('');
    if (picked === TRANSFER_ANSWER.join('')) {
      playBonus();
      enterReveal();
    } else {
      transferMsg = 'Not quite — plug each point into the equation: is (x−h)²/a² + (y−k)²/b² ≤ 1?';
      transferPicks = new Set();
    }
  }

  const LEVELS = [
    {
      name: 'Orbit Match',
      params: ['a', 'b'],
      centerLocked: true,
      briefing: 'Stretch the forcefield.\n  ■ H-RADIUS — horizontal reach\n  ■ V-RADIUS — vertical reach\n\n⚡ ENERGY IS LIMITED: a wide field\nmust be flat; a tall field must be thin.\nA giant circle costs too much.',
      debris: [
        [{ x: 130, y: 15 }, { x: -125, y: -20 }, { x: 10, y: 120 }],
        [{ x: 145, y: -10 }, { x: -15, y: -125 }, { x: -135, y: 20 }],
        [{ x: 120, y: 25 }, { x: -20, y: 115 }, { x: -140, y: -10 }]
      ],
      reveal: 'H-RADIUS stretches horizontally.\nV-RADIUS stretches vertically.\n\nA CIRCLE: a = b.\nAn ELLIPSE: a ≠ b.'
    },
    {
      name: 'Center Shift',
      params: ['a', 'b', 'h', 'k'],
      centerLocked: false,
      briefing: 'New: X-CENTER slides left/right,\nY-CENTER slides up/down.\nPlus H-RADIUS and V-RADIUS.',
      debris: [
        [{ x: 60, y: -60 }, { x: -90, y: 70 }, { x: 80, y: 90 }],
        [{ x: -100, y: -80 }, { x: 50, y: -90 }, { x: 110, y: 30 }],
        [{ x: -70, y: 70 }, { x: 90, y: -50 }, { x: -110, y: -15 }]
      ],
      reveal: 'X-CENTER = h, Y-CENTER = k.\n(x−h)²/a² + (y−k)²/b² = 1\n\nh,k move it. a,b shape it.'
    },
    {
      name: 'Root Access',
      params: ['a', 'b', 'h', 'k'],
      centerLocked: false,
      glitch: true,
      briefing: '⚠ LABELS FAILING ⚠\nRaw math only.',
      debris: [
        [{ x: 50, y: 70 }, { x: -80, y: -50 }, { x: 100, y: -30 }, { x: -60, y: 80 }],
        [{ x: 90, y: -80 }, { x: -50, y: 90 }, { x: 110, y: 40 }, { x: -100, y: -25 }],
        [{ x: 0, y: 100 }, { x: 80, y: 60 }, { x: -90, y: -60 }, { x: 60, y: -90 }]
      ],
      reveal: '(x−h)²/a² + (y−k)²/b² = 1\nh,k = center  a = semi-major  b = semi-minor\nCircle: a = b. Ellipse: a ≠ b.\n★ ORBIT ARCHITECT ★'
    }
  ];

  $: lv = LEVELS[levelIx];

  function loadSweep() {
    debrisSet = lv.debris[currentTarget];
    captured = 0;
    phase = 'playing';
    if (lv.centerLocked) { params.h = 0; params.k = 0; }
    debris = debrisSet.map((d, i) => ({
      ...d, id: i, caught: false,
      dx: (Math.random() - .5) * .3, dy: (Math.random() - .5) * .3
    }));
  }

  function startLevel(l) {
    levelIx = l;
    currentTarget = 0;
    params = { a: 80, b: 80, h: 0, k: 0 };
    phase = 'briefing';
  }

  function inside(x, y) {
    return ((x - params.h) / params.a) ** 2 + ((y - params.k) / params.b) ** 2 <= 1;
  }

  function checkCapture() {
    if (phase !== 'playing') return;
    let any = false;
    for (const d of debris) {
      if (d.caught) continue;
      if (inside(d.x, d.y)) {
        d.caught = true;
        captured++;
        score++;
        any = true;
      }
    }
    if (any) playBonus();
    if (captured >= debrisSet.length) {
      phase = 'success';
      setTimeout(() => {
        if (currentTarget < lv.debris.length - 1) {
          currentTarget++;
          loadSweep();
        } else if (levelIx === LEVELS.length - 1) {
          transferMsg = '';
          transferPicks = new Set();
          phase = 'transfer';
        } else {
          enterReveal();
        }
      }, 1100);
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
    onDone({
      id: config.id,
      reward: Math.min(15, 6 + Math.round(score / 2)),
      arcadeScore: score * 100,
      levelsCleared: 3,
      perfectLevels: 3,
      patternFound: true,
      compared: true,
      transferFirstTry: transferTries <= 1,
      usedHint: transferTries > 1
    });
  }

  function restart() {
    recorded = false;
    score = 0;
    transferTries = 0;
    transferPicks = new Set();
    transferMsg = '';
    startLevel(0);
  }

  function onSlider(key, value) {
    params[key] = Number(value);
    if (key === 'a' || key === 'b') clampBudget(key);
  }

  function handleKey(e) {
    if (phase !== 'playing') return;
    const k = e.key.toLowerCase();
    let used = true;
    if (k === 'a') { params.a = Math.max(RANGES.a.min, params.a - 4); clampBudget('a'); }
    else if (k === 'd') { params.a = Math.min(RANGES.a.max, params.a + 4); clampBudget('a'); }
    else if (k === 'w') { params.b = Math.min(RANGES.b.max, params.b + 4); clampBudget('b'); }
    else if (k === 's') { params.b = Math.max(RANGES.b.min, params.b - 4); clampBudget('b'); }
    else if (!lv.centerLocked && (k === 'arrowleft' || k === 'j')) params.h = Math.max(RANGES.h.min, params.h - 4);
    else if (!lv.centerLocked && (k === 'arrowright' || k === 'l')) params.h = Math.min(RANGES.h.max, params.h + 4);
    else if (!lv.centerLocked && (k === 'arrowup' || k === 'i')) params.k = Math.max(RANGES.k.min, params.k - 4);
    else if (!lv.centerLocked && (k === 'arrowdown' || k === 'k')) params.k = Math.min(RANGES.k.max, params.k + 4);
    else used = false;
    if (used) e.preventDefault();
  }

  function draw() {
    if (!ctx || !P) return;
    ctx.fillStyle = P.bg;
    ctx.fillRect(0, 0, W, H);
    for (const s of stars) {
      ctx.fillStyle = withAlpha(P.accent, s.b);
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    }

    // planet core
    const pulse = 1 + Math.sin(frame * .02) * .03;
    let g = ctx.createRadialGradient(CX, CY, 10 * pulse, CX, CY, 58 * pulse);
    g.addColorStop(0, withAlpha(P.accent, 0.9));
    g.addColorStop(.3, withAlpha(P.accent, 0.5));
    g.addColorStop(.7, withAlpha(P.accent, 0.1));
    g.addColorStop(1, withAlpha(P.accent, 0));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(CX, CY, 58 * pulse, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = P.accent;
    ctx.beginPath(); ctx.arc(CX, CY, 8, 0, Math.PI * 2); ctx.fill();

    // reference orbits
    ctx.strokeStyle = withAlpha(P.accent, 0.15);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(CX, CY, 80, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(CX, CY, 120, 0, Math.PI * 2); ctx.stroke();

    // forcefield ellipse (canvas y grows downward; k is screen-down positive)
    const ex = params.h + CX, ey = params.k + CY, a = params.a, b = params.b;
    ctx.beginPath();
    ctx.ellipse(ex, ey, a, b, 0, 0, Math.PI * 2);
    g = ctx.createRadialGradient(ex, ey, Math.min(a, b) * .3, ex, ey, Math.max(a, b));
    g.addColorStop(0, withAlpha(P.accent, 0));
    g.addColorStop(.5, withAlpha(P.accent, 0.15));
    g.addColorStop(1, withAlpha(P.accent, 0));
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = P.accent;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = P.text;
    ctx.beginPath(); ctx.arc(ex, ey, 3, 0, Math.PI * 2); ctx.fill();

    // debris
    for (const db of debris) {
      if (db.caught) {
        ctx.fillStyle = withAlpha(P.green, 0.6);
        ctx.beginPath(); ctx.arc(db.x + CX, db.y + CY, 3, 0, Math.PI * 2); ctx.fill();
        continue;
      }
      db.x += db.dx;
      db.y += db.dy;
      if (Math.abs(db.x) > 185) db.dx *= -1;
      if (Math.abs(db.y) > 195) db.dy *= -1;
      ctx.fillStyle = P.yellow;
      ctx.shadowColor = P.yellow;
      ctx.shadowBlur = 6;
      ctx.beginPath(); ctx.arc(db.x + CX, db.y + CY, 4, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }

    // header strip
    ctx.fillStyle = withAlpha(P.surface, 0.85);
    ctx.fillRect(0, 0, W, 26);
    ctx.fillStyle = P.textDim;
    ctx.font = `bold 10px ${P.font}`;
    ctx.fillText(`SWEEP ${currentTarget + 1}/${lv.debris.length}`, 10, 17);
    ctx.fillText(`CAPTURED ${captured}/${debrisSet ? debrisSet.length : 0}`, W - 118, 17);

    if (phase === 'success') {
      ctx.fillStyle = withAlpha(P.green, 0.12);
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = P.greenText;
      ctx.font = `bold 20px ${P.font}`;
      ctx.textAlign = 'center';
      ctx.fillText('ORBIT SECURED', W / 2, H / 2 - 20);
      ctx.textAlign = 'start';
    }
  }

  function loop() {
    frame++;
    if (phase === 'playing') checkCapture();
    if (phase !== 'briefing' && phase !== 'reveal' && c) draw();
    af = requestAnimationFrame(loop);
  }

  onMount(() => {
    ctx = c.getContext('2d');
    P = resolvePalette();
    const unwatch = watchTheme((next) => { P = next; });
    startLevel(0);
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
  score={score * 100}
  streak={score > 2 ? score : 0}
  onExit={() => { if (phase === 'reveal' && levelIx === LEVELS.length - 1) finishGame(); onExit(); }}
>
  <canvas
    bind:this={c}
    class="pf"
    class:hidden={phase === 'briefing' || phase === 'reveal' || phase === 'transfer'}
    width={W}
    height={H}
    aria-label="Orbit Architect starfield"
  ></canvas>

  {#if phase === 'playing' || phase === 'success'}
    <div class="energy" class:maxed={energyPct >= 99}>
      <span>⚡ Field energy (a·b)</span>
      <div class="ebar"><i style={`width:${energyPct}%`}></i></div>
      <b>{energyUsed.toLocaleString()} / {BUDGET.toLocaleString()}</b>
    </div>
    <div class="controls">
      {#each lv.params as key (key)}
        <label class="ctl">
          <span>{lv.glitch ? RAW_LABELS[key] : LABELS[key]} · {Math.round(params[key])}</span>
          <input
            type="range"
            min={RANGES[key].min}
            max={RANGES[key].max}
            step={RANGES[key].step}
            value={params[key]}
            on:input={(e) => onSlider(key, e.currentTarget.value)}
            disabled={phase !== 'playing'}
            aria-label={LABELS[key]}
          />
        </label>
      {/each}
    </div>
  {/if}

  {#if phase === 'transfer'}
    <div class="r transfer" in:fly={{ x: reduceMotion ? 0 : 16, duration: reduceMotion ? 0 : 200 }}>
      <div class="k">Final check — read the equation</div>
      <p class="teq">(x−90)² / 120² &nbsp;+&nbsp; y² / 30² &nbsp;=&nbsp; 1</p>
      <p>A field with this equation powers up.<br />Tap every debris it would capture, then confirm.</p>
      <svg class="tmap" viewBox="-190 -140 380 280" aria-label="Debris map">
        <line x1="-185" y1="0" x2="185" y2="0" class="axis" />
        <line x1="0" y1="-135" x2="0" y2="135" class="axis" />
        {#each TRANSFER_DEBRIS as d (d.id)}
          <g
            class="tdot"
            class:picked={transferPicks.has(d.id)}
            role="button"
            tabindex="0"
            on:click={() => togglePick(d.id)}
            on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { togglePick(d.id); e.preventDefault(); } }}
          >
            <circle cx={d.x} cy={-d.y} r="13" class="thit" />
            <circle cx={d.x} cy={-d.y} r="6" class="tcore" />
            <text x={d.x} y={-d.y - 17} text-anchor="middle">{d.id} ({d.x}, {d.y})</text>
          </g>
        {/each}
      </svg>
      {#if transferMsg}<p class="tmsg">{transferMsg}</p>{/if}
      <button class="p" on:click={submitTransfer} disabled={transferPicks.size === 0}>
        Power the field ▸
      </button>
    </div>
  {/if}

  {#if phase === 'briefing'}
    <div class="b" in:fly={{ x: reduceMotion ? 0 : 16, duration: reduceMotion ? 0 : 200 }}>
      <h2>{lv.name}</h2>
      <p style="white-space:pre-line">{lv.briefing}</p>
      <button class="p" on:click={loadSweep}>Begin</button>
    </div>
  {:else if phase === 'reveal'}
    <div class="r" in:fly={{ x: reduceMotion ? 0 : 16, duration: reduceMotion ? 0 : 200 }}>
      <div class="k">Decoded</div>
      <h2>{lv.name}</h2>
      <p style="white-space:pre-line;color:var(--qx-green-text)">{lv.reveal}</p>
      <p style="color:var(--qx-accent-text);font-weight:900">★ {score} debris captured ★</p>
      {#if levelIx < LEVELS.length - 1}
        <button class="p" on:click={() => startLevel(levelIx + 1)}>Next satellite</button>
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
  .pf { width: 100%; border: 1px solid var(--qx-border); border-radius: 14px; background: var(--qx-bg); }
  .pf.hidden { display: none; }
  .energy { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 8px; margin-top: 10px; }
  .energy span { color: var(--qx-text-dim); font-size: 10px; font-weight: 900; letter-spacing: .06em; text-transform: uppercase; }
  .energy b { color: var(--qx-text-dim); font-size: 10px; font-variant-numeric: tabular-nums; }
  .energy.maxed b { color: var(--qx-danger-text); }
  .ebar { height: 6px; border-radius: 999px; background: var(--qx-surface-3); overflow: hidden; }
  .ebar i { display: block; height: 100%; border-radius: inherit; background: var(--qx-accent); transition: width .15s ease; }
  .energy.maxed .ebar i { background: var(--qx-danger); }
  .transfer .teq { font-family: ui-monospace, Menlo, monospace; font-size: 15px; font-weight: 800; color: var(--qx-text); border: 1.5px solid var(--qx-accent); border-radius: 12px; background: var(--qx-accent-soft); padding: 10px 14px; }
  .tmap { width: 100%; border: 1px solid var(--qx-border); border-radius: 14px; background: var(--qx-bg); }
  .axis { stroke: var(--qx-border); stroke-width: 1; }
  .tdot { cursor: pointer; }
  .thit { fill: transparent; stroke: var(--qx-border-2); stroke-dasharray: 3 3; }
  .tcore { fill: var(--qx-yellow); }
  .tdot.picked .thit { stroke: var(--qx-green); stroke-dasharray: none; stroke-width: 2.5; fill: var(--qx-green-soft); }
  .tdot text { fill: var(--qx-text-dim); font-size: 11px; font-weight: 800; }
  .tmsg { color: var(--qx-danger-text); font-size: 12px; font-weight: 700; }
  .controls { display: grid; gap: 7px; margin-top: 10px; grid-template-columns: 1fr 1fr; }
  .ctl { display: grid; gap: 3px; }
  .ctl span { color: var(--qx-text-dim); font-size: 10px; font-weight: 900; letter-spacing: .06em; text-transform: uppercase; font-variant-numeric: tabular-nums; }
  .ctl input { width: 100%; accent-color: var(--qx-accent); min-height: 28px; }
  .p, .s { min-height: 46px; width: 100%; border-radius: 999px; font-family: var(--qx-font); font-size: 14px; font-weight: 900; cursor: pointer; }
  .p { border: none; background: var(--qx-accent); color: var(--qx-bg); }
  .s { border: 1.5px solid var(--qx-border-2); background: var(--qx-surface); color: var(--qx-text-dim); margin-top: 6px; }
  .ra { width: 100%; display: grid; gap: 7px; }
</style>
