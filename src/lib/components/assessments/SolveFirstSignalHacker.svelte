<script>
  // Signal Hacker — a Solve First sine-wave arcade.
  //
  // Match a hidden target wave by tuning VOLUME (amplitude), PITCH (frequency),
  // H-SHIFT (phase) and V-SHIFT (vertical translation). Only the final vault
  // names them: f(x) = A·sin(ωx + φ) + D.
  //
  // Rewritten 2026-07-29: canvas colors resolved from Qubix tokens (canvas
  // ignores var()/color-mix), touch sliders + a BREACH button added (it was
  // keyboard-only), duplicate keydown listener removed, and the discovery is
  // recorded when the final reveal is reached rather than only via one button.
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

  const W = 380, H = 380;
  let c, ctx, af, recorded = false;
  let P = null;

  let phase = 'briefing', levelIx = 0, score = 0, frame = 0;
  let params = { amp: 1, freq: 1, phase: 0, vShift: 0 };
  let target = { amp: 0, freq: 0, phase: 0, vShift: 0 };
  let matchPct = 0, unlocked = false, currentTarget = 0, scanLine = 0;

  // ROOT CHALLENGE — the active decode. After the last lock, the target wave
  // goes DARK and only its equation is shown. The learner must set the
  // sliders by READING the formula, not by matching a picture.
  const DECODE_TARGET = { amp: 70, freq: 2.0, phase: Math.PI, vShift: -20 };
  const DECODE_EQUATION = 'f(x) = 70 · sin(2.0x + 1.0π) − 20';
  let decodeMode = false;

  const RANGES = {
    amp:    { min: 5,   max: 120, step: 1 },
    freq:   { min: 0.2, max: 5,   step: 0.1 },
    phase:  { min: 0,   max: Math.PI * 2, step: 0.1 },
    vShift: { min: -80, max: 80,  step: 2 }
  };
  const LABELS = { amp: 'Volume', freq: 'Pitch', phase: 'H-shift', vShift: 'V-shift' };
  const RAW_LABELS = { amp: 'A', freq: 'ω', phase: 'φ', vShift: 'D' };

  const LEVELS = [
    {
      name: 'Signal Match',
      params: ['amp', 'freq'],
      briefing: 'Two controls:\n  ■ VOLUME — wave height\n  ■ PITCH — cycle speed\n\nMatch the target (dim).\nYour signal is bright.',
      targets: [
        { amp: 60, freq: 2.0, phase: 0, vShift: 0 },
        { amp: 90, freq: 1.0, phase: 0, vShift: 0 },
        { amp: 40, freq: 3.5, phase: 0, vShift: 0 }
      ],
      reveal: 'VOLUME = AMPLITUDE.\nPITCH = FREQUENCY.\n\nAmplitude: wave height from center.\nFrequency: cycles across the screen.\n\nYou just tuned a sine wave.'
    },
    {
      name: 'Phase Shift',
      params: ['amp', 'freq', 'phase', 'vShift'],
      briefing: 'Four controls:\n  ■ H-SHIFT — slide left/right\n  ■ V-SHIFT — lift whole wave\n\nPlus VOLUME and PITCH.',
      targets: [
        { amp: 70, freq: 2.0, phase: 1.5, vShift: 0 },
        { amp: 60, freq: 1.5, phase: 0, vShift: 50 },
        { amp: 80, freq: 2.5, phase: 0.8, vShift: -30 }
      ],
      reveal: 'H-SHIFT = PHASE SHIFT (φ).\nV-SHIFT = VERTICAL TRANSLATION (D).\n\nf(x) = A·sin(ωx + φ) + D\n\nEvery term is under your control.'
    },
    {
      name: 'Root Access',
      params: ['amp', 'freq', 'phase', 'vShift'],
      briefing: '⚠ LABELS FAILING ⚠\n\nRaw math only.\nYou already know what these do.',
      targets: [
        { amp: 50, freq: 3.0, phase: 0.5, vShift: 20, glitch: true },
        { amp: 100, freq: 0.8, phase: 2.0, vShift: -40, glitch: true },
        { amp: 70, freq: 1.8, phase: 1.0, vShift: 0, glitch: true }
      ],
      reveal: 'YOU MASTERED SINE WAVES.\n\nf(x) = A·sin(ωx + φ) + D\n\nA = amplitude  ω = frequency\nφ = phase shift  D = vertical shift\n\n★ SIGNAL HACKER ★'
    }
  ];

  $: lv = LEVELS[levelIx];
  $: tgt = lv.targets[currentTarget];
  $: glitched = !!tgt?.glitch || decodeMode;

  function initLevel(l) {
    levelIx = l;
    currentTarget = 0;
    score = 0;
    matchPct = 0;
    unlocked = false;
    phase = 'briefing';
    randomizeParams();
  }

  function loadTarget() {
    target = { ...LEVELS[levelIx].targets[currentTarget] };
    randomizeParams();
    computeMatch();
    phase = 'playing';
  }

  function randomizeParams() {
    params = {
      amp: 25 + Math.random() * 35,
      freq: 1.5 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
      vShift: (Math.random() - .5) * 60
    };
  }

  function computeMatch() {
    const active = lv.params;
    let total = 0;
    const spans = { amp: 60, freq: 2.5, phase: Math.PI, vShift: 80 };
    for (const key of active) {
      const diff = key === 'phase'
        ? Math.min(Math.abs(params[key] - target[key]), Math.PI * 2 - Math.abs(params[key] - target[key]))
        : Math.abs(params[key] - target[key]);
      total += Math.max(0, 1 - diff / Math.max(spans[key], 1));
    }
    matchPct = Math.round((total / active.length) * 100);
    unlocked = matchPct >= 85;
  }

  function onSlider(key, value) {
    params[key] = Number(value);
    computeMatch();
  }

  function crackVault() {
    if (!unlocked || phase !== 'playing') return;
    phase = 'success';
    score++;
    playBonus();
    setTimeout(() => {
      if (currentTarget < lv.targets.length - 1) {
        currentTarget++;
        loadTarget();
      } else if (levelIx === LEVELS.length - 1 && !decodeMode) {
        startDecode();
      } else {
        decodeMode = false;
        enterReveal();
      }
    }, 1100);
  }

  function startDecode() {
    decodeMode = true;
    target = { ...DECODE_TARGET };
    randomizeParams();
    computeMatch();
    phase = 'playing';
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
      reward: Math.min(15, 6 + score * 2),
      arcadeScore: score * 100,
      levelsCleared: 3,
      perfectLevels: score >= LEVELS.reduce((n, l) => n + l.targets.length, 0) ? 3 : 2,
      patternFound: true,
      compared: true,
      transferFirstTry: true,
      usedHint: false
    });
  }

  function restart() {
    recorded = false;
    decodeMode = false;
    initLevel(0);
  }

  const keyMap = {
    '1': ['amp', -5], 'q': ['amp', 5],
    '2': ['freq', -0.2], 'w': ['freq', 0.2],
    '3': ['phase', -0.2], 'e': ['phase', 0.2],
    '4': ['vShift', -6], 'r': ['vShift', 6]
  };

  function handleKey(e) {
    if (phase !== 'playing') return;
    const bind = keyMap[e.key];
    if (bind) {
      const [k, d] = bind;
      let v = params[k] + d;
      if (k === 'phase') v = ((v % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      else v = Math.max(RANGES[k].min, Math.min(RANGES[k].max, v));
      params[k] = v;
      computeMatch();
      e.preventDefault();
    }
    if (e.key === ' ' && unlocked) { crackVault(); e.preventDefault(); }
  }

  function fmt(key) {
    const v = params[key];
    if (glitched) {
      return key === 'phase'
        ? `${RAW_LABELS[key]}=${(v / Math.PI).toFixed(1)}π`
        : `${RAW_LABELS[key]}=${key === 'freq' ? v.toFixed(1) : Math.round(v)}`;
    }
    return key === 'phase' ? `${(v / Math.PI).toFixed(1)}π` : key === 'freq' ? v.toFixed(1) : String(Math.round(v));
  }

  function draw() {
    if (!ctx || !P) return;
    ctx.fillStyle = P.bg;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = P.border;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3;
    for (let x = 0; x < W; x += 36) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 36) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.globalAlpha = 1;

    const cy = H / 2 + 10;
    ctx.strokeStyle = withAlpha(P.textFaint, 0.4);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();

    // target wave (dim) — hidden during the ROOT CHALLENGE: read the equation
    if (!decodeMode) {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const y = cy - (target.amp * Math.sin(target.freq * (x / W) * Math.PI * 2 + target.phase) + target.vShift);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = withAlpha(P.green, 0.35);
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // player wave (bright, glowing)
    ctx.beginPath();
    for (let x = 0; x <= W; x += 2) {
      const y = cy - (params.amp * Math.sin(params.freq * (x / W) * Math.PI * 2 + params.phase) + params.vShift);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = P.accent;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = P.accent;
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // match tint
    if (matchPct > 60) {
      ctx.fillStyle = withAlpha(P.green, (matchPct - 60) / 400);
      ctx.fillRect(0, 0, W, H);
    }

    // header strip
    ctx.fillStyle = withAlpha(P.surface, 0.85);
    ctx.fillRect(0, 0, W, 26);
    ctx.fillStyle = P.textDim;
    ctx.font = `bold 10px ${P.font}`;
    ctx.fillText(decodeMode ? 'ROOT CHALLENGE · target wave DARK' : `VAULT ${levelIx + 1} · LOCK ${currentTarget + 1}/${lv.targets.length}`, 10, 17);
    ctx.fillStyle = unlocked ? P.green : P.textDim;
    ctx.fillText(`MATCH ${matchPct}%`, W / 2 - 24, 17);
    if (unlocked) {
      ctx.fillStyle = P.green;
      ctx.fillText(decodeMode ? '◄ TRANSMIT READY' : '◄ BREACH READY', W - 118, 17);
    }

    // scanline + glitch
    scanLine = (scanLine + 2) % H;
    ctx.fillStyle = withAlpha(P.accent, 0.05);
    ctx.fillRect(0, scanLine, W, 1);
    if (glitched && frame % 28 < 5) {
      ctx.fillStyle = withAlpha(P.accent, 0.06);
      for (let i = 0; i < 2; i++) {
        ctx.fillRect(Math.random() * W, Math.random() * H, Math.random() * 70, Math.random() * 2);
      }
    }

    if (phase === 'success') {
      ctx.fillStyle = withAlpha(P.green, 0.12);
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = P.greenText;
      ctx.font = `bold 20px ${P.font}`;
      ctx.textAlign = 'center';
      ctx.fillText('ACCESS GRANTED', W / 2, H / 2 - 20);
      ctx.textAlign = 'start';
    }
  }

  function loop() {
    frame++;
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
  score={score * 100}
  streak={score > 2 ? score : 0}
  onExit={() => { if (phase === 'reveal' && levelIx === LEVELS.length - 1) finishGame(); onExit(); }}
>
  <canvas
    bind:this={c}
    class="pf"
    class:hidden={phase === 'briefing' || phase === 'reveal'}
    width={W}
    height={H}
    aria-label="Signal Hacker oscilloscope"
  ></canvas>

  {#if phase === 'playing' || phase === 'success'}
    {#if decodeMode}
      <div class="deq">
        <span>Root challenge — the target wave is dark. Set the dials from the equation alone:</span>
        <b>{DECODE_EQUATION}</b>
      </div>
    {/if}
    <div class="controls">
      {#each lv.params as key (key)}
        <label class="ctl">
          <span>{glitched ? RAW_LABELS[key] : LABELS[key]} · {fmt(key)}</span>
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
      <button class="breach" class:armed={unlocked} on:click={crackVault} disabled={!unlocked || phase !== 'playing'}>
        {unlocked ? (decodeMode ? 'TRANSMIT ▸' : 'BREACH ▸') : `MATCH ${matchPct}% — need 85%`}
      </button>
    </div>
  {/if}

  {#if phase === 'briefing'}
    <div class="b" in:fly={{ x: reduceMotion ? 0 : 16, duration: reduceMotion ? 0 : 200 }}>
      <h2>VAULT {levelIx + 1} — {lv.name}</h2>
      <p style="white-space:pre-line">{lv.briefing}</p>
      <button class="p" on:click={loadTarget}>Begin</button>
    </div>
  {:else if phase === 'reveal'}
    <div class="r" in:fly={{ x: reduceMotion ? 0 : 16, duration: reduceMotion ? 0 : 200 }}>
      <div class="k">Decoded</div>
      <h2>{lv.name}</h2>
      <p style="white-space:pre-line;color:var(--qx-green-text)">{lv.reveal}</p>
      <p style="color:var(--qx-accent-text);font-weight:900">★ {score} locks cracked ★</p>
      {#if levelIx < LEVELS.length - 1}
        <button class="p" on:click={() => initLevel(levelIx + 1)}>Next vault</button>
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
  .deq { display: grid; gap: 4px; margin-top: 10px; border: 1.5px solid var(--qx-accent); border-radius: 12px; background: var(--qx-accent-soft); padding: 10px 12px; }
  .deq span { color: var(--qx-text-dim); font-size: 11px; font-weight: 700; line-height: 1.35; }
  .deq b { font-family: ui-monospace, Menlo, monospace; font-size: 14px; font-weight: 800; color: var(--qx-text); }
  .controls { display: grid; gap: 7px; margin-top: 10px; grid-template-columns: 1fr 1fr; }
  .ctl { display: grid; gap: 3px; }
  .ctl span { color: var(--qx-text-dim); font-size: 10px; font-weight: 900; letter-spacing: .06em; text-transform: uppercase; font-variant-numeric: tabular-nums; }
  .ctl input { width: 100%; accent-color: var(--qx-accent); min-height: 28px; }
  .breach { grid-column: 1 / -1; min-height: 46px; border: 1.5px solid var(--qx-border-2); border-radius: 999px; background: var(--qx-surface); color: var(--qx-text-faint); font: 900 13px var(--qx-font); cursor: default; transition: background .2s, color .2s; }
  .breach.armed { border: none; background: var(--qx-green); color: var(--qx-bg); cursor: pointer; }
  .p, .s { min-height: 46px; width: 100%; border-radius: 999px; font-family: var(--qx-font); font-size: 14px; font-weight: 900; cursor: pointer; }
  .p { border: none; background: var(--qx-accent); color: var(--qx-bg); }
  .s { border: 1.5px solid var(--qx-border-2); background: var(--qx-surface); color: var(--qx-text-dim); margin-top: 6px; }
  .ra { width: 100%; display: grid; gap: 7px; }
</style>
