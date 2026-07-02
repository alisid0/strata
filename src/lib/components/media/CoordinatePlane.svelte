<script>
  // GeoGebra-style coordinate plane for Qubix.
  // spec: {
  //   xRange: [min, max], yRange: [min, max],
  //   gridStep?: number,          // default 1
  //   showGrid?: boolean,         // default true
  //   points?: [{x, y, label?, color?}],
  //   lines?: [{m, c, label?, color?, dashed?, width?} | {x1,y1,x2,y2, label?, color?, dashed?, width?}],
  //   segments?: [{x1,y1,x2,y2, color?, dashed?, arrow?}],
  //   triangles?: [{x1,y1,x2,y2,x3,y3, fill?, label?, rightAngle?}],
  //   interactive?: boolean       // if true, points are draggable
  // }
  export let spec = {};

  let svgEl;
  let dragging = null;

  const PAD = 44;
  const SIZE = 420;
  const plotSize = SIZE - 2 * PAD;

  $: xMin = spec.xRange?.[0] ?? -5;
  $: xMax = spec.xRange?.[1] ?? 5;
  $: yMin = spec.yRange?.[0] ?? -5;
  $: yMax = spec.yRange?.[1] ?? 5;
  $: gridStep = spec.gridStep ?? 1;
  $: showGrid = spec.showGrid !== false;
  $: interactive = spec.interactive === true;

  function toX(mx) { return PAD + ((mx - xMin) / (xMax - xMin)) * plotSize; }
  function toY(my) { return PAD + plotSize - ((my - yMin) / (yMax - yMin)) * plotSize; }
  function fromX(sx) { return xMin + ((sx - PAD) / plotSize) * (xMax - xMin); }
  function fromY(sy) { return yMin + ((plotSize - (sy - PAD)) / plotSize) * (yMax - yMin); }

  $: axX = toX(0);
  $: axY = toY(0);
  $: xAxisOn = 0 >= yMin && 0 <= yMax;
  $: yAxisOn = 0 >= xMin && 0 <= xMax;

  $: gridLines = (() => {
    if (!showGrid || gridStep <= 0) return { h: [], v: [] };
    const h = [], v = [];
    for (let x = Math.ceil(xMin / gridStep) * gridStep; x <= xMax; x += gridStep) v.push(x);
    for (let y = Math.ceil(yMin / gridStep) * gridStep; y <= yMax; y += gridStep) h.push(y);
    return { h, v };
  })();

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

  function lineEndpoints(line) {
    if (line.x1 !== undefined) {
      return { x1: toX(line.x1), y1: toY(line.y1), x2: toX(line.x2), y2: toY(line.y2) };
    }
    const m = line.m ?? 0, c = line.c ?? 0;
    return { x1: toX(xMin), y1: toY(m * xMin + c), x2: toX(xMax), y2: toY(m * xMax + c) };
  }

  function handlePointerDown(e, idx) {
    if (!interactive) return;
    e.preventDefault(); e.stopPropagation();
    dragging = idx;
    svgEl.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e) {
    if (dragging === null || !svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    const scale = SIZE / rect.width;
    const sx = (e.clientX - rect.left) * scale;
    const sy = (e.clientY - rect.top) * scale;
    spec.points[dragging] = { ...spec.points[dragging], x: Math.round(fromX(sx) * 10) / 10, y: Math.round(fromY(sy) * 10) / 10 };
    spec = spec;
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
  <rect x="0" y="0" width={SIZE} height={SIZE} fill="#fafaf8" rx="4" />

  <defs>
    <clipPath id="plotClip">
      <rect x={PAD} y={PAD} width={plotSize} height={plotSize} />
    </clipPath>
    <marker id="arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
      <polygon points="0 0, 7 2.5, 0 5" fill="#444" />
    </marker>
  </defs>

  <g clip-path="url(#plotClip)">
    <!-- Grid -->
    {#each gridLines.v as x}
      <line x1={toX(x)} y1={PAD} x2={toX(x)} y2={SIZE - PAD} stroke="#d4d8dd" stroke-width="0.6" />
    {/each}
    {#each gridLines.h as y}
      <line x1={PAD} y1={toY(y)} x2={SIZE - PAD} y2={toY(y)} stroke="#d4d8dd" stroke-width="0.6" />
    {/each}

    <!-- Triangles -->
    {#each spec.triangles || [] as tri}
      <polygon points="{toX(tri.x1)},{toY(tri.y1)} {toX(tri.x2)},{toY(tri.y2)} {toX(tri.x3)},{toY(tri.y3)}"
        fill={tri.fill || '#e8ecf0'} stroke="#8899aa" stroke-width="1.2" opacity="0.7" />
      {#if tri.rightAngle}
        {@const cx = toX(tri.rightAngle[0])}
        {@const cy = toY(tri.rightAngle[1])}
        <rect x={cx - 7} y={cy - 7} width="7" height="7" fill="none" stroke="#8899aa" stroke-width="1" />
      {/if}
      {#if tri.label}
        <text x={toX((tri.x1+tri.x2+tri.x3)/3)} y={toY((tri.y1+tri.y2+tri.y3)/3)-7}
          text-anchor="middle" fill="#556" font-size="12" font-weight="600">{tri.label}</text>
      {/if}
    {/each}

    <!-- Lines -->
    {#each spec.lines || [] as line}
      {@const ep = lineEndpoints(line)}
      <line x1={ep.x1} y1={ep.y1} x2={ep.x2} y2={ep.y2}
        stroke={line.color || '#2563eb'} stroke-width={line.width || 2.2}
        stroke-dasharray={line.dashed ? '7,4' : 'none'} />
      {#if line.label}
        <text x={(ep.x1+ep.x2)/2 + 12} y={(ep.y1+ep.y2)/2 - 10}
          fill={line.color || '#2563eb'} font-size="13" font-weight="700">{line.label}</text>
      {/if}
    {/each}

    <!-- Segments -->
    {#each spec.segments || [] as seg}
      <line x1={toX(seg.x1)} y1={toY(seg.y1)} x2={toX(seg.x2)} y2={toY(seg.y2)}
        stroke={seg.color || '#dc2626'} stroke-width="1.6"
        stroke-dasharray={seg.dashed ? '6,4' : 'none'}
        marker-end={seg.arrow ? 'url(#arrow)' : ''} />
    {/each}

    <!-- Points -->
    {#each spec.points || [] as pt, i}
      <circle cx={toX(pt.x)} cy={toY(pt.y)} r="6"
        fill={pt.color || '#2563eb'} stroke="#fff" stroke-width="2"
        class:interactive
        on:pointerdown={(e) => handlePointerDown(e, i)} />
      {#if pt.label}
        <text x={toX(pt.x) + 10} y={toY(pt.y) - 10}
          fill="#222" font-size="13" font-weight="700">{pt.label}</text>
      {/if}
    {/each}
  </g>

  <!-- Axes on top -->
  {#if xAxisOn}
    <line x1={PAD} y1={axY} x2={SIZE - PAD} y2={axY} stroke="#444" stroke-width="1.8" marker-end="url(#arrow)" />
    <text x={SIZE - PAD + 4} y={axY + 5} fill="#444" font-size="14" font-weight="800" font-style="italic">x</text>
  {/if}
  {#if yAxisOn}
    <line x1={axX} y1={SIZE - PAD} x2={axX} y2={PAD} stroke="#444" stroke-width="1.8" marker-end="url(#arrow)" />
    <text x={axX + 6} y={PAD - 8} fill="#444" font-size="14" font-weight="800" font-style="italic">y</text>
  {/if}

  <!-- Tick marks & numbers -->
  {#each xTicks as x}
    <line x1={toX(x)} y1={axY - 5} x2={toX(x)} y2={axY + 5} stroke="#444" stroke-width="1.2" />
    <text x={toX(x)} y={axY + 20} text-anchor="middle" fill="#444" font-size="12" font-weight="600">{x}</text>
  {/each}
  {#each yTicks as y}
    <line x1={axX - 5} y1={toY(y)} x2={axX + 5} y2={toY(y)} stroke="#444" stroke-width="1.2" />
    <text x={axX - 9} y={toY(y) + 5} text-anchor="end" fill="#444" font-size="12" font-weight="600">{y}</text>
  {/each}

  {#if xAxisOn && yAxisOn}
    <text x={axX - 7} y={axY + 19} text-anchor="end" fill="#444" font-size="12" font-weight="600">O</text>
  {/if}
</svg>

<style>
  .coord-plane {
    display: block;
    border-radius: 8px;
    border: 1px solid #d4d8dd;
    background: #fafaf8;
    user-select: none;
    touch-action: none;
  }
  circle.interactive { cursor: grab; }
  circle.interactive:active { cursor: grabbing; }
</style>
