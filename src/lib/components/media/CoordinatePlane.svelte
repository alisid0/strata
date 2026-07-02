<script>
  // Clean coordinate plane — minimal, GeoGebra-like.
  // spec: {
  //   xRange: [min, max], yRange: [min, max],
  //   points?: [{x, y, label?, color?}],
  //   lines?: [{m, c, label?, color?, dashed?} | {x1,y1,x2,y2, label?, color?, dashed?}],
  //   curves?: [{fn, domain?, color?, dashed?, label?, labelAt?}],
  //   segments?: [{x1,y1,x2,y2, color?, dashed?, arrow?}],
  //   triangles?: [{x1,y1,x2,y2,x3,y3, fill?, label?, rightAngle?}],
  //   interactive?: boolean
  // }
  export let spec = {};

  let svgEl;
  let dragging = null;
  const PAD = 44, SIZE = 420, plotSize = SIZE - 2 * PAD;

  $: xMin = spec.xRange?.[0] ?? -1;
  $: xMax = spec.xRange?.[1] ?? 6;
  $: yMin = spec.yRange?.[0] ?? -0.5;
  $: yMax = spec.yRange?.[1] ?? 2.5;
  $: gridStep = spec.gridStep ?? 1;
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
    if (gridStep <= 0) return { h: [], v: [] };
    const h = [], v = [];
    for (let x = Math.ceil(xMin / gridStep) * gridStep; x <= xMax; x += gridStep) v.push(x);
    for (let y = Math.ceil(yMin / gridStep) * gridStep; y <= yMax; y += gridStep) h.push(y);
    return { h, v };
  })();

  $: xTicks = (() => { const t = []; for (let x = Math.ceil(xMin); x <= xMax; x++) if (x !== 0) t.push(x); return t; })();
  $: yTicks = (() => { const t = []; for (let y = Math.ceil(yMin); y <= yMax; y++) if (y !== 0) t.push(y); return t; })();

  function lineEndpoints(line) {
    if (line.x1 !== undefined) return { x1: toX(line.x1), y1: toY(line.y1), x2: toX(line.x2), y2: toY(line.y2) };
    const m = line.m ?? 0, c = line.c ?? 0;
    return { x1: toX(xMin), y1: toY(m * xMin + c), x2: toX(xMax), y2: toY(m * xMax + c) };
  }

  function makeFn(fn) {
    if (typeof fn === 'function') return fn;
    try { const f = new Function('x', 'with(Math){return (' + fn + ');}'); return x => f(x); }
    catch (_) { return () => NaN; }
  }

  function curvePath(curve) {
    const f = makeFn(curve.fn);
    const [d0, d1] = curve.domain || [xMin, xMax];
    const N = curve.samples || 200;
    let d = '', pen = false;
    for (let i = 0; i <= N; i++) {
      const x = d0 + (d1 - d0) * (i / N);
      const y = f(x);
      if (!isFinite(y) || Math.abs(y - yMin) > (yMax - yMin) * 4) { pen = false; continue; }
      const cmd = pen ? 'L' : 'M';
      d += `${cmd}${toX(x).toFixed(1)},${toY(y).toFixed(1)}`;
      pen = true;
    }
    return d;
  }

  function handleDown(e, i) { if (!interactive) return; e.preventDefault(); dragging = i; svgEl.setPointerCapture(e.pointerId); }
  function handleMove(e) {
    if (dragging === null || !svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    const scale = SIZE / rect.width;
    spec.points[dragging] = { ...spec.points[dragging], x: Math.round(fromX((e.clientX - rect.left) * scale) * 10) / 10, y: Math.round(fromY((e.clientY - rect.top) * scale) * 10) / 10 };
    spec = spec;
  }
  function handleUp() { dragging = null; }
</script>

<svg bind:this={svgEl} class="coord-plane" viewBox="0 0 {SIZE} {SIZE}" style="width:100%;height:100%"
  on:pointermove={handleMove} on:pointerup={handleUp} on:pointerleave={handleUp} role="img" aria-label="Coordinate plane">

  <rect x="0" y="0" width={SIZE} height={SIZE} fill="#fafaf8" rx="4" />

  <!-- Grid — subtle dashed -->
  {#each gridLines.v as x}
    <line x1={toX(x)} y1={PAD} x2={toX(x)} y2={SIZE - PAD} stroke="#d8dce3" stroke-width="0.5" stroke-dasharray="3,3" />
  {/each}
  {#each gridLines.h as y}
    <line x1={PAD} y1={toY(y)} x2={SIZE - PAD} y2={toY(y)} stroke="#d8dce3" stroke-width="0.5" stroke-dasharray="3,3" />
  {/each}

  <!-- Axes -->
  {#if xAxisOn}
    <line x1={PAD} y1={axY} x2={SIZE - PAD} y2={axY} stroke="#333" stroke-width="1.6" />
    <polygon points="{SIZE - PAD},{axY} {SIZE - PAD - 9},{axY - 4.5} {SIZE - PAD - 9},{axY + 4.5}" fill="#333" />
    <text x={SIZE - PAD - 2} y={axY - 9} text-anchor="end" fill="#333" font-size="14" font-style="italic" font-weight="700">x</text>
  {/if}
  {#if yAxisOn}
    <line x1={axX} y1={PAD} x2={axX} y2={SIZE - PAD} stroke="#333" stroke-width="1.6" />
    <polygon points="{axX},{PAD} {axX - 4.5},{PAD + 9} {axX + 4.5},{PAD + 9}" fill="#333" />
    <text x={axX + 10} y={PAD + 6} text-anchor="start" fill="#333" font-size="14" font-style="italic" font-weight="700">y</text>
  {/if}

  <!-- Ticks -->
  {#each xTicks as x}
    <line x1={toX(x)} y1={axY - 4} x2={toX(x)} y2={axY + 4} stroke="#555" stroke-width="1" />
    <text x={toX(x)} y={axY + 18} text-anchor="middle" fill="#555" font-size="11" font-weight="500">{x}</text>
  {/each}
  {#each yTicks as y}
    <line x1={axX - 4} y1={toY(y)} x2={axX + 4} y2={toY(y)} stroke="#555" stroke-width="1" />
    <text x={axX - 8} y={toY(y) + 4} text-anchor="end" fill="#555" font-size="11" font-weight="500">{y}</text>
  {/each}
  {#if xAxisOn && yAxisOn}
    <text x={axX - 6} y={axY + 18} text-anchor="end" fill="#555" font-size="11" font-weight="500">0</text>
  {/if}

  <!-- Curves -->
  {#each spec.curves || [] as curve}
    <path d={curvePath(curve)} fill="none" stroke={curve.color || '#2563eb'} stroke-width="2.2"
      stroke-dasharray={curve.dashed ? '6,4' : 'none'} stroke-linejoin="round" stroke-linecap="round" />
    {#if curve.label}
      <text x={toX(curve.labelAt ?? xMax - 1)} y={toY(makeFn(curve.fn)(curve.labelAt ?? xMax - 1)) - 8}
        fill={curve.color || '#2563eb'} font-size="13" font-weight="800" font-style="italic">{curve.label}</text>
    {/if}
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
      stroke={line.color || '#2563eb'} stroke-width="2" stroke-dasharray={line.dashed ? '7,4' : 'none'} />
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

  <defs>
    <marker id="arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
      <polygon points="0 0, 7 2.5, 0 5" fill="#333" />
    </marker>
  </defs>

  <!-- Drop-lines for interactive points -->
  {#if interactive}
    {#each spec.points || [] as pt}
      <line x1={toX(pt.x)} y1={toY(0)} x2={toX(pt.x)} y2={toY(pt.y)} stroke="#aaa" stroke-width="1" stroke-dasharray="4,4" />
      <line x1={toX(0)} y1={toY(pt.y)} x2={toX(pt.x)} y2={toY(pt.y)} stroke="#aaa" stroke-width="1" stroke-dasharray="4,4" />
    {/each}
  {/if}

  <!-- Points -->
  {#each spec.points || [] as pt, i}
    <circle cx={toX(pt.x)} cy={toY(pt.y)} r={interactive ? 6 : 4.5}
      fill={pt.color || '#2563eb'} stroke="#fff" stroke-width="2"
      class:interactive on:pointerdown={(e) => handleDown(e, i)} />
    {#if interactive}
      <text x={toX(pt.x) + 9} y={toY(pt.y) - 9} fill="#333" font-size="12" font-weight="700">({pt.x}, {pt.y})</text>
    {:else if pt.label}
      <text x={toX(pt.x) + 9} y={toY(pt.y) - 9} fill="#333" font-size="12" font-weight="700">{pt.label}</text>
    {/if}
  {/each}
</svg>

<style>
  .coord-plane { display:block; border-radius:8px; border:1px solid #d8dce3; background:#fafaf8; user-select:none; touch-action:none; }
  circle.interactive { cursor:grab; }
  circle.interactive:active { cursor:grabbing; }
</style>
