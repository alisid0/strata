<script>
  import { onMount } from 'svelte';

  // spec: {
  //   xRange: [min, max], yRange: [min, max],
  //   gridStep?: number,          // default 1
  //   showGrid?: boolean,         // default true
  //   showAxes?: boolean,         // default true
  //   points?: [{x, y, label?, color?, radius?}],
  //   lines?: [{m, c, label?, stroke?, dashed?} | {x1,y1,x2,y2, label?, stroke?, dashed?}],
  //   segments?: [{x1,y1,x2,y2, stroke?, dashed?, arrow?}],
  //   shade?: [{x1,x2, above, below, fill?}],   // region shading
  //   triangles?: [{x1,y1,x2,y2,x3,y3, fill?, label?, rightAngle?}],  // slope triangles
  //   interactive?: boolean
  // }
  export let spec = {};

  let svgEl;
  let dragging = null;

  const PAD = 32;      // padding inside SVG
  const SIZE = 400;     // viewBox size
  const plotSize = SIZE - 2 * PAD;

  $: xMin = spec.xRange?.[0] ?? -5;
  $: xMax = spec.xRange?.[1] ?? 5;
  $: yMin = spec.yRange?.[0] ?? -5;
  $: yMax = spec.yRange?.[1] ?? 5;
  $: gridStep = spec.gridStep ?? 1;
  $: showGrid = spec.showGrid !== false;
  $: showAxes = spec.showAxes !== false;
  $: interactive = spec.interactive === true;

  function toX(mx) { return PAD + ((mx - xMin) / (xMax - xMin)) * plotSize; }
  function toY(my) { return PAD + plotSize - ((my - yMin) / (yMax - yMin)) * plotSize; }
  function fromX(sx) { return xMin + ((sx - PAD) / plotSize) * (xMax - xMin); }
  function fromY(sy) { return yMin + ((plotSize - (sy - PAD)) / plotSize) * (yMax - yMin); }

  // Grid lines
  $: gridLines = (() => {
    if (!showGrid || gridStep <= 0) return { h: [], v: [] };
    const h = [], v = [];
    for (let x = Math.ceil(xMin / gridStep) * gridStep; x <= xMax; x += gridStep) v.push(x);
    for (let y = Math.ceil(yMin / gridStep) * gridStep; y <= yMax; y += gridStep) h.push(y);
    return { h, v };
  })();

  // Axis positions
  $: axX = toX(0);
  $: axY = toY(0);
  $: xAxisVisible = 0 >= yMin && 0 <= yMax;
  $: yAxisVisible = 0 >= xMin && 0 <= xMax;

  // Compute line endpoints from slope-intercept or two-point
  function lineEndpoints(line) {
    if (line.x1 !== undefined) {
      return { x1: toX(line.x1), y1: toY(line.y1), x2: toX(line.x2), y2: toY(line.y2) };
    }
    const m = line.m ?? 0, c = line.c ?? 0;
    const y1 = m * xMin + c, y2 = m * xMax + c;
    return { x1: toX(xMin), y1: toY(y1), x2: toX(xMax), y2: toY(y2) };
  }

  // Ticks
  $: xTicks = (() => {
    const t = [];
    for (let x = Math.ceil(xMin); x <= xMax; x++) if (x !== 0) t.push(x);
    return t;
  })();
  $: yTicks = (() => {
    const t = [];
    for (let y = Math.ceil(yMin); y <= yMax; y++) if (y !== 0) t.push(y);
    return t;
  })();

  function handlePointerDown(e, idx) {
    if (!interactive) return;
    e.preventDefault();
    dragging = idx;
    svgEl.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e) {
    if (dragging === null || !svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * SIZE;
    const sy = ((e.clientY - rect.top) / rect.height) * SIZE;
    const mx = Math.round(fromX(sx) * 10) / 10;
    const my = Math.round(fromY(sy) * 10) / 10;
    spec.points[dragging] = { ...spec.points[dragging], x: mx, y: my };
    spec = spec; // trigger reactivity
  }

  function handlePointerUp() { dragging = null; }
</script>

<svg
  bind:this={svgEl}
  class="coord-plane"
  viewBox="0 0 {SIZE} {SIZE}"
  style="width:100%;height:100%"
  on:pointermove={handlePointerMove}
  on:pointerup={handlePointerUp}
  on:pointerleave={handlePointerUp}
  role="img"
  aria-label="Coordinate plane"
>
  <!-- Background -->
  <rect x="0" y="0" width={SIZE} height={SIZE} fill="var(--qx-surface-2)" rx="8" />

  <!-- Grid -->
  {#each gridLines.v as x}
    <line x1={toX(x)} y1={PAD} x2={toX(x)} y2={SIZE - PAD}
      stroke="var(--qx-border)" stroke-width="0.5" />
  {/each}
  {#each gridLines.h as y}
    <line x1={PAD} y1={toY(y)} x2={SIZE - PAD} y2={toY(y)}
      stroke="var(--qx-border)" stroke-width="0.5" />
  {/each}

  <!-- Axes -->
  {#if showAxes}
    {#if xAxisVisible}
      <line x1={PAD} y1={axY} x2={SIZE - PAD} y2={axY}
        stroke="var(--qx-text-2)" stroke-width="2" />
      <polygon points="{SIZE - PAD},{axY} {SIZE - PAD - 9},{axY - 4.5} {SIZE - PAD - 9},{axY + 4.5}"
        fill="var(--qx-text-2)" />
      <text x={SIZE - PAD - 2} y={axY - 9} text-anchor="end"
        fill="var(--qx-text-2)" font-size="14" font-style="italic" font-weight="700" font-family="var(--qx-font)">x</text>
    {/if}
    {#if yAxisVisible}
      <line x1={axX} y1={PAD} x2={axX} y2={SIZE - PAD}
        stroke="var(--qx-text-2)" stroke-width="2" />
      <polygon points="{axX},{PAD} {axX - 4.5},{PAD + 9} {axX + 4.5},{PAD + 9}"
        fill="var(--qx-text-2)" />
      <text x={axX + 10} y={PAD + 6} text-anchor="start"
        fill="var(--qx-text-2)" font-size="14" font-style="italic" font-weight="700" font-family="var(--qx-font)">y</text>
    {/if}
  {/if}

  <!-- Tick marks & labels -->
  {#each xTicks as x}
    <line x1={toX(x)} y1={axY - 4} x2={toX(x)} y2={axY + 4}
      stroke="var(--qx-text-faint)" stroke-width="1" />
    <text x={toX(x)} y={axY + 18} text-anchor="middle"
      fill="var(--qx-text-faint)" font-size="10" font-family="var(--qx-font)">{x}</text>
  {/each}
  {#each yTicks as y}
    <line x1={axX - 4} y1={toY(y)} x2={axX + 4} y2={toY(y)}
      stroke="var(--qx-text-faint)" stroke-width="1" />
    <text x={axX - 8} y={toY(y) + 4} text-anchor="end"
      fill="var(--qx-text-faint)" font-size="10" font-family="var(--qx-font)">{y}</text>
  {/each}

  <!-- Origin label -->
  {#if xAxisVisible && yAxisVisible}
    <text x={axX - 5} y={axY + 16} text-anchor="end"
      fill="var(--qx-text-faint)" font-size="10" font-family="var(--qx-font)">O</text>
  {/if}

  <!-- Shaded regions -->
  {#each spec.shade || [] as s}
    <rect x={toX(s.x1)} y={toY(s.above ?? yMax)} width={toX(s.x2) - toX(s.x1)}
      height={toY(s.below ?? yMin) - toY(s.above ?? yMax)}
      fill={s.fill || 'var(--qx-accent-soft)'} opacity="0.4" />
  {/each}

  <!-- Slope triangles -->
  {#each spec.triangles || [] as tri}
    <polygon points="{toX(tri.x1)},{toY(tri.y1)} {toX(tri.x2)},{toY(tri.y2)} {toX(tri.x3)},{toY(tri.y3)}"
      fill={tri.fill || 'var(--qx-yellow-soft)'} stroke="var(--qx-yellow)" stroke-width="1"
      opacity="0.6" />
    {#if tri.rightAngle}
      {@const cx = toX(tri.rightAngle[0])}
      {@const cy = toY(tri.rightAngle[1])}
      <rect x={cx - 6} y={cy - 6} width="6" height="6" fill="none"
        stroke="var(--qx-text-faint)" stroke-width="0.8" />
    {/if}
    {#if tri.label}
      <text x={toX((tri.x1 + tri.x2 + tri.x3) / 3)} y={toY((tri.y1 + tri.y2 + tri.y3) / 3) - 6}
        text-anchor="middle" fill="var(--qx-text-dim)" font-size="10" font-family="var(--qx-font)">{tri.label}</text>
    {/if}
  {/each}

  <!-- Lines -->
  {#each spec.lines || [] as line, i}
    {@const ep = lineEndpoints(line)}
    <line x1={ep.x1} y1={ep.y1} x2={ep.x2} y2={ep.y2}
      stroke={line.stroke || 'var(--qx-accent)'} stroke-width="2"
      stroke-dasharray={line.dashed ? '6,3' : 'none'} />
    {#if line.label}
      <text x={(ep.x1 + ep.x2) / 2 + 10} y={(ep.y1 + ep.y2) / 2 - 8}
        fill={line.stroke || 'var(--qx-accent)'} font-size="11" font-weight="700"
        font-family="var(--qx-font)">{line.label}</text>
    {/if}
  {/each}

  <!-- Segments (arrows / directed lines) -->
  {#each spec.segments || [] as seg}
    <line x1={toX(seg.x1)} y1={toY(seg.y1)} x2={toX(seg.x2)} y2={toY(seg.y2)}
      stroke={seg.stroke || 'var(--qx-accent)'} stroke-width="1.8"
      stroke-dasharray={seg.dashed ? '5,4' : 'none'}
      marker-end={seg.arrow ? 'url(#arrowhead)' : ''} />
  {/each}

  <!-- Arrowhead marker -->
  <defs>
    <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="var(--qx-accent)" />
    </marker>
  </defs>

  <!-- Drop-lines for interactive points (follow the drag, like a textbook) -->
  {#if interactive}
    {#each spec.points || [] as pt}
      <line x1={toX(pt.x)} y1={toY(0)} x2={toX(pt.x)} y2={toY(pt.y)}
        stroke="var(--qx-text-dim)" stroke-width="1.5" stroke-dasharray="5,4" />
      <line x1={toX(0)} y1={toY(pt.y)} x2={toX(pt.x)} y2={toY(pt.y)}
        stroke="var(--qx-text-dim)" stroke-width="1.5" stroke-dasharray="5,4" />
    {/each}
  {/if}

  <!-- Points -->
  {#each spec.points || [] as pt, i}
    <circle cx={toX(pt.x)} cy={toY(pt.y)} r={pt.radius ?? 4}
      fill={pt.color || 'var(--qx-accent)'}
      class:interactive
      on:pointerdown={(e) => handlePointerDown(e, i)} />
    {#if interactive}
      <text x={toX(pt.x) + 9} y={toY(pt.y) - 9}
        fill="var(--qx-text)" font-size="12.5" font-weight="800"
        font-family="var(--qx-font)">({pt.x}, {pt.y})</text>
    {:else if pt.label}
      <text x={toX(pt.x) + 8} y={toY(pt.y) - 8}
        fill="var(--qx-text)" font-size="12" font-weight="700"
        font-family="var(--qx-font)">{pt.label}</text>
    {/if}
  {/each}
</svg>

<style>
  .coord-plane {
    display: block;
    border-radius: var(--qx-radius-md);
    border: 1.5px solid var(--qx-border-2);
    user-select: none;
    touch-action: none;
  }
  circle.interactive { cursor: grab; r: 6; }
  circle.interactive:active { cursor: grabbing; }
</style>
