<script>
  // Transformation Lab — the graph-transformation signature lab. Drag a live
  // curve onto a ghosted target by moving its anchor (translation, c/d) and a
  // stretch point (vertical scale, a). The progression walks translate ->
  // stretch -> flip on a parabola, then TRANSFERS the same two controls to a
  // different parent shape (|x|) so the learner feels that y = a·f(x−c)+d is one
  // rule that reshapes any function. Contract matches every other engine:
  // `prompt` in, `onDone(score, max)` out; a 1/1 completion gate on finish.
  export let prompt = 'Drag the curve onto its shadow. Move the anchor, then stretch.';
  export let onDone = () => {};

  const reduceMotion = typeof matchMedia !== 'undefined'
    && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Geometry: math space [-6,6] x [-5.6,5.6] mapped to a 300x280 viewBox ─────
  const W = 300, H = 280, S = 25, OX = W / 2, OY = H / 2;
  const XMIN = -6.2, XMAX = 6.2;
  const toX = (x) => OX + x * S;
  const toY = (y) => OY - y * S;
  const toMathX = (px) => (px - OX) / S;
  const toMathY = (py) => (OY - py) / S;
  const clampY = (y) => Math.max(-14, Math.min(14, y)); // keep path coords sane

  // ── Parent functions. All transformed as y = a · f(x − c) + d. ──────────────
  const PARENT = {
    quadratic: { f: (x) => x * x,       label: (a, c, d) => `${a}(x ${sc(c)})² ${sd(d)}` },
    absolute:  { f: (x) => Math.abs(x), label: (a, c, d) => `${a}|x ${sc(c)}| ${sd(d)}` }
  };
  const sc = (c) => (c === 0 ? '' : c > 0 ? `− ${c}` : `+ ${-c}`);
  const sd = (d) => (d === 0 ? '' : d > 0 ? `+ ${d}` : `− ${-d}`);

  // ── Stages: parent + target params + which controls are live. ───────────────
  const STAGES = [
    { type: 'quadratic', target: { a: 1, c: 3, d: -2 }, lockA: true,
      tip: 'Only the green anchor moves. Slide it onto the shadow’s tip.' },
    { type: 'quadratic', target: { a: 2, c: -1, d: 1 }, lockA: false,
      tip: 'New control: drag the amber point to stretch the curve taller.' },
    { type: 'quadratic', target: { a: -1, c: -3, d: 2 }, lockA: false,
      tip: 'Pull the amber point below the anchor — a negative stretch flips it.' },
    { type: 'absolute', target: { a: 2, c: 1, d: -3 }, lockA: false,
      tip: 'Different shape, same two controls. The rule doesn’t care.' }
  ];

  let stageIx = 0;
  let params = { a: 1, c: 0, d: 0 };
  let matched = false;      // current stage matched
  let complete = false;     // whole lab done
  let activeHandle = null;  // 'vertex' | 'stretch' | null
  let svgEl;

  $: stage = STAGES[stageIx];
  $: parent = PARENT[stage.type];
  // Stretch handle sits where f(x−c) = 1 (x = c+1 for x² and |x|), so its height
  // is a + d and dragging it vertically maps straight to the scale a.
  $: stretchX = stage.lockA ? null : params.c + 1;
  $: stretchY = stage.lockA ? null : params.a + params.d;

  function initStage() {
    // Start each stage away from the answer so there's something to do.
    const t = STAGES[stageIx].target;
    params = { a: STAGES[stageIx].lockA ? t.a : 1, c: 0, d: 0 };
    matched = false;
  }

  function pathFor(p, type) {
    const f = PARENT[type].f;
    let d = '';
    for (let x = XMIN; x <= XMAX; x += 0.06) {
      const y = clampY(p.a * f(x - p.c) + p.d);
      d += (d ? ' L' : 'M') + toX(x).toFixed(1) + ',' + toY(y).toFixed(1);
    }
    return d;
  }
  $: learnerPath = pathFor(params, stage.type);
  $: targetPath = pathFor(stage.target, stage.type);

  // ── Dragging ────────────────────────────────────────────────────────────────
  function svgPoint(e) {
    const r = svgEl.getBoundingClientRect();
    return {
      px: ((e.clientX - r.left) / r.width) * W,
      py: ((e.clientY - r.top) / r.height) * H
    };
  }
  function down(e) {
    if (matched) return;
    const { px, py } = svgPoint(e);
    const vd = Math.hypot(px - toX(params.c), py - toY(params.d));
    const sd_ = stage.lockA ? Infinity : Math.hypot(px - toX(stretchX), py - toY(stretchY));
    if (!stage.lockA && sd_ < vd && sd_ < 20) activeHandle = 'stretch';
    else if (vd < 22) activeHandle = 'vertex';
    else return;
    e.target.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  }
  function move(e) {
    if (!activeHandle || matched) return;
    const { px, py } = svgPoint(e);
    if (activeHandle === 'vertex') {
      params.c = clampP(Math.round(toMathX(px)), -5, 5);
      params.d = clampP(Math.round(toMathY(py)), -5, 5);
    } else {
      let a = Math.round(toMathY(py) - params.d);
      a = clampP(a, -4, 4);
      if (a === 0) a = toMathY(py) - params.d >= 0 ? 1 : -1;
      params.a = a;
    }
    params = params;
    checkMatch();
  }
  const clampP = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  function up() { activeHandle = null; }

  function checkMatch() {
    const t = stage.target;
    const near = Math.abs(params.a - t.a) < 0.25
      && Math.abs(params.c - t.c) < 0.25
      && Math.abs(params.d - t.d) < 0.25;
    if (near && !matched) {
      matched = true;
      activeHandle = null;
      const delay = reduceMotion ? 0 : 700;
      if (stageIx < STAGES.length - 1) {
        setTimeout(() => { stageIx += 1; initStage(); }, delay);
      } else {
        setTimeout(() => { complete = true; }, delay);
      }
    }
  }

  initStage();
</script>

<div class="fl">
  <div class="fl-hud">
    <div class="fl-eq">
      {#if complete}
        <span class="fl-done-copy">One rule, any shape ✓</span>
      {:else}
        f(x) =
        <span class="p-a">{params.a}</span>{stage.type === 'absolute' ? '|x' : '(x'}
        <span class="p-c">{sc(params.c) || '− 0'}</span>{stage.type === 'absolute' ? '|' : ')²'}
        <span class="p-d">{sd(params.d) || '+ 0'}</span>
      {/if}
    </div>
    <div class="fl-dots">
      {#each STAGES as _, i}
        <span class="dot" class:on={i < stageIx || (i === stageIx && matched)} class:cur={i === stageIx && !complete}></span>
      {/each}
    </div>
  </div>

  <div class="fl-stage-tip">{complete ? prompt : stage.tip}</div>

  <div class="fl-canvas" class:matched>
    <svg bind:this={svgEl} viewBox="0 0 {W} {H}"
         on:pointerdown={down} on:pointermove={move} on:pointerup={up} on:pointerleave={up}>
      <!-- grid -->
      {#each Array(13) as _, i}
        <line class="grid" x1={toX(i - 6)} y1="0" x2={toX(i - 6)} y2={H} />
        <line class="grid" x1="0" y1={toY(i - 6)} x2={W} y2={toY(i - 6)} />
      {/each}
      <!-- axes -->
      <line class="axis" x1="0" y1={OY} x2={W} y2={OY} />
      <line class="axis" x1={OX} y1="0" x2={OX} y2={H} />
      <!-- target (ghost) -->
      <path class="ghost" d={targetPath} />
      <!-- learner curve -->
      <path class="curve" class:matched d={learnerPath} />
      {#if !complete}
        <!-- stretch handle (a) -->
        {#if !stage.lockA}
          <line class="lead" x1={toX(params.c)} y1={toY(params.d)} x2={toX(stretchX)} y2={toY(stretchY)} />
          <circle class="handle stretch" class:active={activeHandle === 'stretch'}
                  cx={toX(stretchX)} cy={toY(stretchY)} r="8" />
        {/if}
        <!-- vertex / anchor handle (c, d) -->
        <circle class="handle vertex" class:active={activeHandle === 'vertex'}
                cx={toX(params.c)} cy={toY(params.d)} r="9" />
      {/if}
    </svg>
    {#if matched && !complete}<div class="fl-flash">Matched ✓</div>{/if}
  </div>

  <div class="fl-foot">
    {#if complete}
      <button class="fl-primary" on:click={() => onDone(1, 1)}>Continue</button>
    {:else}
      <span class="fl-legend"><span class="k vertex"></span>move &nbsp; <span class="k stretch"></span>stretch</span>
    {/if}
  </div>
</div>

<style>
  .fl { display: flex; flex-direction: column; gap: 10px; align-items: stretch; }

  .fl-hud { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .fl-eq {
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 15px; font-weight: 700; color: var(--qx-text); white-space: nowrap;
  }
  .p-a { color: var(--qx-yellow-text); font-weight: 800; }
  .p-c, .p-d { color: var(--qx-green-text); font-weight: 800; }
  .fl-done-copy { color: var(--qx-green-text); font-weight: 800; }
  .fl-dots { display: flex; gap: 6px; }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--qx-border-2); }
  .dot.on { background: var(--qx-green); }
  .dot.cur { background: var(--qx-accent); }

  .fl-stage-tip {
    font-size: 13px; font-weight: 600; color: var(--qx-text-dim); line-height: 1.35; min-height: 34px;
  }

  .fl-canvas { position: relative; border: 1.5px solid var(--qx-border); border-radius: 12px; overflow: hidden; background: var(--qx-surface); }
  svg { display: block; width: 100%; height: auto; touch-action: none; cursor: grab; }
  svg:active { cursor: grabbing; }

  .grid { stroke: var(--qx-border); stroke-width: 1; opacity: 0.5; pointer-events: none; }
  .axis { stroke: var(--qx-text-faint); stroke-width: 1.4; pointer-events: none; }
  .ghost { fill: none; stroke: var(--qx-text-faint); stroke-width: 3; stroke-dasharray: 7 7; opacity: 0.7; pointer-events: none; }
  .curve { fill: none; stroke: var(--qx-accent); stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; pointer-events: none; transition: stroke 0.2s; }
  .curve.matched { stroke: var(--qx-green); }
  .lead { stroke: var(--qx-yellow); stroke-width: 1.5; stroke-dasharray: 3 3; opacity: 0.8; pointer-events: none; }

  .handle { stroke: var(--qx-surface); stroke-width: 2.5; cursor: grab; }
  .handle.vertex { fill: var(--qx-green); }
  .handle.stretch { fill: var(--qx-yellow); }
  .handle.active { stroke: var(--qx-text); }

  .fl-flash {
    position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
    background: var(--qx-green-soft); color: var(--qx-green-text); border: 1.5px solid var(--qx-green);
    font-size: 13px; font-weight: 800; padding: 5px 14px; border-radius: 999px;
  }

  .fl-foot { display: flex; justify-content: center; min-height: 40px; align-items: center; }
  .fl-legend { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 650; color: var(--qx-text-faint); }
  .fl-legend .k { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
  .fl-legend .k.vertex { background: var(--qx-green); }
  .fl-legend .k.stretch { background: var(--qx-yellow); }
  .fl-primary {
    border: none; border-radius: 999px; background: var(--qx-accent); color: #fff;
    font-family: var(--qx-font); font-size: 14px; font-weight: 850; min-height: 40px; padding: 0 26px; cursor: pointer;
  }
</style>
