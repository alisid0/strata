<script>
  // Local Linearity Studio — zoom into a point until a curve either flattens
  // into a straight line (smooth / differentiable) or stays a bent corner
  // (non-differentiable). The viewport always shows the same box but the world
  // window it covers shrinks with zoom (±BASE/zoom around the point), so smooth
  // curves straighten and |x|-style corners stay self-similar. At high zoom the
  // left/right micro-slopes are read out: agree → one slope exists (smooth);
  // disagree → no single slope (corner). Bridges "average over an interval"
  // (RateIntervalBench) to "slope at a point" (the tangent lab). Contract:
  // prompt in, onDone(1,1) on finish.
  export let prompt = 'Up close, a smooth curve looks like a straight line; a corner never does.';
  export let onDone = () => {};

  const reduceMotion = typeof matchMedia !== 'undefined'
    && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const W = 300, H = 250, OX = W / 2, OY = H / 2, VIEW = 105, BASE = 3;
  const ZOOMS = [1, 10, 100, 1000];

  const STAGES = [
    { name: 'y = x²', fn: (x) => x * x, a: 1.5, smooth: true,
      tip: 'Zoom into the marked point on this parabola. Does it straighten out?' },
    { name: 'y = |x|', fn: (x) => Math.abs(x), a: 0, smooth: false,
      tip: 'Same idea at the tip of this V. Keep zooming — does it ever straighten?' },
    { name: 'y = sin x', fn: (x) => Math.sin(x), a: 1, smooth: true,
      tip: 'Last one, on a wave. Straight line up close, or a corner?' }
  ];

  let stageIx = 0;
  let zoom = 1;
  let matched = false;
  let complete = false;
  let wrongHint = '';
  let svgEl;

  $: stage = STAGES[stageIx];
  $: fa = stage.fn(stage.a);
  $: hw = BASE / zoom;
  $: canJudge = zoom >= 100;                 // must zoom in before deciding
  // one-sided micro-slopes measured inside the visible window
  $: eps = hw * 0.25;
  $: leftSlope = (stage.fn(stage.a) - stage.fn(stage.a - eps)) / eps;
  $: rightSlope = (stage.fn(stage.a + eps) - stage.fn(stage.a)) / eps;
  $: curve = curvePath(stage, hw);

  const sx = (x) => OX + ((x - stage.a) / hw) * VIEW;
  const sy = (y) => OY - ((y - fa) / hw) * VIEW;

  function curvePath(s, halfW) {
    let d = '';
    const lo = s.a - halfW, hi = s.a + halfW, step = (2 * halfW) / 260;
    for (let x = lo; x <= hi; x += step) {
      const px = OX + ((x - s.a) / halfW) * VIEW;
      const py = OY - ((s.fn(x) - s.fn(s.a)) / halfW) * VIEW;
      d += (d ? ' L' : 'M') + px.toFixed(1) + ',' + Math.max(-40, Math.min(H + 40, py)).toFixed(1);
    }
    return d;
  }

  function setZoom(z) { zoom = z; wrongHint = ''; }
  function initStage() { zoom = 1; matched = false; wrongHint = ''; }

  function judge(saidSmooth) {
    if (matched || !canJudge) return;
    if (saidSmooth === stage.smooth) {
      matched = true;
      const delay = reduceMotion ? 0 : 850;
      if (stageIx < STAGES.length - 1) setTimeout(() => { stageIx += 1; initStage(); }, delay);
      else setTimeout(() => { complete = true; }, delay);
    } else {
      wrongHint = saidSmooth
        ? 'Look again — the two sides never line up. Zoom more.'
        : 'Keep zooming — it really is straightening into one line.';
    }
  }

  initStage();
</script>

<div class="ll">
  <div class="ll-hud">
    <div class="ll-fn">{complete ? 'Smooth = looks straight up close ✓' : stage.name} <span class="ll-at">{complete ? '' : `at x = ${stage.a}`}</span></div>
    <div class="ll-dots">
      {#each STAGES as _, i}
        <span class="dot" class:on={i < stageIx || (i === stageIx && matched)} class:cur={i === stageIx && !complete}></span>
      {/each}
    </div>
  </div>

  <div class="ll-tip" class:warn={wrongHint}>
    {#if complete}{prompt}{:else if wrongHint}{wrongHint}{:else}{stage.tip}{/if}
  </div>

  <div class="ll-canvas">
    <svg bind:this={svgEl} viewBox="0 0 {W} {H}">
      <!-- crosshair marking the inspection point (always centred) -->
      <line class="cross" x1={OX - 10} y1={OY} x2={OX + 10} y2={OY} />
      <line class="cross" x1={OX} y1={OY - 10} x2={OX} y2={OY + 10} />
      <path class="curve" class:smoothhit={matched} d={curve} />
      <circle class="pt" cx={OX} cy={OY} r="4.5" />
    </svg>
    <div class="ll-zoomtag">{zoom}×</div>
    {#if matched && !complete}<div class="ll-flash">{stage.smooth ? 'Smooth ✓' : 'Corner ✓'}</div>{/if}
  </div>

  <!-- micro-slope readout (meaningful once zoomed in) -->
  <div class="ll-slopes" class:live={canJudge}>
    {#if canJudge}
      left slope <b>{leftSlope.toFixed(2)}</b> · right slope <b>{rightSlope.toFixed(2)}</b>
      <span class="ll-verdict">{Math.abs(leftSlope - rightSlope) < 0.05 ? '→ they agree: one slope' : '→ they disagree: no single slope'}</span>
    {:else}
      zoom to 100× to measure the slope on each side
    {/if}
  </div>

  <div class="ll-controls">
    <div class="ll-zoom">
      {#each ZOOMS as z}
        <button class="zbtn" class:on={zoom === z} on:click={() => setZoom(z)}>{z}×</button>
      {/each}
    </div>
  </div>

  <div class="ll-foot">
    {#if complete}
      <button class="ll-primary" on:click={() => onDone(1, 1)}>Continue</button>
    {:else}
      <div class="ll-judge">
        <button class="jbtn smooth" disabled={!canJudge || matched} on:click={() => judge(true)}>Straight line</button>
        <button class="jbtn corner" disabled={!canJudge || matched} on:click={() => judge(false)}>Sharp corner</button>
      </div>
    {/if}
  </div>
</div>

<style>
  .ll { display: flex; flex-direction: column; gap: 9px; }
  .ll-hud { display: flex; align-items: center; justify-content: space-between; }
  .ll-fn { font-family: ui-monospace, Menlo, monospace; font-size: 14px; font-weight: 800; color: var(--qx-text); }
  .ll-at { color: var(--qx-text-dim); font-weight: 600; }
  .ll-dots { display: flex; gap: 6px; }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--qx-border-2); }
  .dot.on { background: var(--qx-green); }
  .dot.cur { background: var(--qx-accent); }

  .ll-tip { font-size: 13px; font-weight: 600; color: var(--qx-text-dim); line-height: 1.35; min-height: 34px; }
  .ll-tip.warn { color: var(--qx-yellow-text); }

  .ll-canvas { position: relative; border: 1.5px solid var(--qx-border); border-radius: 12px; overflow: hidden; background: var(--qx-surface); }
  svg { display: block; width: 100%; height: auto; }
  .cross { stroke: var(--qx-text-faint); stroke-width: 1.2; }
  .curve { fill: none; stroke: var(--qx-accent); stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; }
  .curve.smoothhit { stroke: var(--qx-green); }
  .pt { fill: var(--qx-green); stroke: var(--qx-surface); stroke-width: 2; }
  .ll-zoomtag { position: absolute; top: 8px; right: 10px; font-family: ui-monospace, Menlo, monospace; font-size: 12px; font-weight: 800; color: var(--qx-text-dim); background: var(--qx-surface-2); border-radius: 6px; padding: 2px 7px; }
  .ll-flash { position: absolute; top: 8px; left: 50%; transform: translateX(-50%); background: var(--qx-green-soft); color: var(--qx-green-text); border: 1.5px solid var(--qx-green); font-size: 13px; font-weight: 800; padding: 4px 13px; border-radius: 999px; }

  .ll-slopes { font-family: ui-monospace, Menlo, monospace; font-size: 12px; font-weight: 650; color: var(--qx-text-faint); text-align: center; min-height: 18px; }
  .ll-slopes.live { color: var(--qx-text-dim); }
  .ll-slopes b { color: var(--qx-text); }
  .ll-verdict { display: block; font-size: 11.5px; color: var(--qx-text-faint); margin-top: 1px; }

  .ll-controls { display: flex; justify-content: center; }
  .ll-zoom { display: inline-flex; gap: 6px; }
  .zbtn { border: 1.5px solid var(--qx-border-2); background: var(--qx-surface); color: var(--qx-text-dim); border-radius: 999px; font-family: var(--qx-font); font-size: 12px; font-weight: 800; padding: 6px 12px; cursor: pointer; }
  .zbtn.on { background: var(--qx-accent); color: #fff; border-color: transparent; }

  .ll-foot { display: flex; justify-content: center; align-items: center; min-height: 42px; }
  .ll-judge { display: flex; gap: 10px; }
  .jbtn { border-radius: 999px; font-family: var(--qx-font); font-size: 13px; font-weight: 800; min-height: 40px; padding: 0 18px; cursor: pointer; border: 1.5px solid var(--qx-border-2); background: var(--qx-surface); color: var(--qx-text); }
  .jbtn:disabled { opacity: 0.45; cursor: default; }
  .jbtn.smooth:not(:disabled) { border-color: var(--qx-green); color: var(--qx-green-text); }
  .jbtn.corner:not(:disabled) { border-color: var(--qx-yellow); color: var(--qx-yellow-text); }
  .ll-primary { border: none; border-radius: 999px; background: var(--qx-accent); color: #fff; font-family: var(--qx-font); font-size: 14px; font-weight: 850; min-height: 40px; padding: 0 26px; cursor: pointer; }
</style>
