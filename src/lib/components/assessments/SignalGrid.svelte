<script>
  // Movement stage for Find the Signal. Renders the blacked-out rescue map: a
  // home marker, the locator drone, rescue signals, and an optional L-shaped
  // route trace. Vocabulary is staged by `mode`:
  //   plain  — blocks + home marker only, no numbers or axis letters
  //   signed — adds the console's compact +/-/0 numbers along the two tunnels
  //   formal — the reveal: adds x / y letters, the origin label, and quadrants
  // It never prints "x", "y", "axis", "origin" or "quadrant" before mode=formal.
  export let drone = null;        // { x, y } | null
  export let signals = [];        // [{ x, y, label?, found?, faint? }]
  export let trace = [];          // [{ x, y }] polyline points (grid coords)
  export let mode = 'plain';      // 'plain' | 'signed' | 'formal'
  export let showColumn = null;   // highlight a whole vertical tunnel at this x
  export let caption = '';        // accessible description of the current state

  const R = 4;                    // grid spans -4..4
  const CX = 120, CY = 120, CELL = 26;
  const gx = (x) => CX + x * CELL;
  const gy = (y) => CY - y * CELL;
  const ticks = [-4, -3, -2, -1, 1, 2, 3, 4];

  $: tracePath = trace.length
    ? trace.map((p, i) => `${i === 0 ? 'M' : 'L'}${gx(p.x)},${gy(p.y)}`).join(' ')
    : '';
  $: quadrants = mode === 'formal'
    ? [
        { t: 'I', x: 2.4, y: 2.4 }, { t: 'II', x: -2.4, y: 2.4 },
        { t: 'III', x: -2.4, y: -2.4 }, { t: 'IV', x: 2.4, y: -2.4 }
      ]
    : [];
</script>

<svg class="signal-grid" viewBox="0 0 240 240" role="img" aria-label={caption || 'Rescue map'}>
  <rect x="0" y="0" width="240" height="240" rx="10" fill="var(--qx-surface-elevated)" />

  <!-- block grid -->
  {#each Array(2 * R + 1) as _, i}
    <line x1={gx(i - R)} y1={gy(-R)} x2={gx(i - R)} y2={gy(R)} stroke="var(--qx-border)" stroke-width="0.6" opacity="0.5" />
    <line x1={gx(-R)} y1={gy(i - R)} x2={gx(R)} y2={gy(i - R)} stroke="var(--qx-border)" stroke-width="0.6" opacity="0.5" />
  {/each}

  {#if quadrants.length}
    {#each quadrants as q}
      <text x={gx(q.x)} y={gy(q.y)} text-anchor="middle" font-size="10" font-weight="500"
        fill="var(--qx-text-faint)" font-family="var(--qx-font)">{q.t}</text>
    {/each}
  {/if}

  {#if showColumn !== null}
    <rect x={gx(showColumn) - CELL / 2} y={gy(R)} width={CELL} height={2 * R * CELL}
      fill="var(--qx-accent-soft)" opacity="0.5" />
  {/if}

  <!-- the two tunnels through home -->
  <line x1={gx(-R)} y1={gy(0)} x2={gx(R)} y2={gy(0)} stroke="var(--qx-text-faint)" stroke-width="1.6" />
  {#if mode !== 'plain'}
    <line x1={gx(0)} y1={gy(-R)} x2={gx(0)} y2={gy(R)} stroke="var(--qx-text-faint)" stroke-width="1.6" />
  {/if}

  <!-- compact +/-/0 numbers (signed and formal) -->
  {#if mode !== 'plain'}
    {#each ticks as t}
      <text x={gx(t)} y={gy(0) + 12} text-anchor="middle" font-size="8.5" font-weight="500"
        fill="var(--qx-text-dim)" font-family="var(--qx-font)">{t > 0 ? `+${t}` : t}</text>
      <text x={gx(0) - 9} y={gy(t) + 3} text-anchor="end" font-size="8.5" font-weight="500"
        fill="var(--qx-text-dim)" font-family="var(--qx-font)">{t > 0 ? `+${t}` : t}</text>
    {/each}
    <text x={gx(0) - 6} y={gy(0) + 12} text-anchor="end" font-size="8.5" font-weight="500"
      fill="var(--qx-text-dim)" font-family="var(--qx-font)">0</text>
  {/if}

  <!-- formal axis letters -->
  {#if mode === 'formal'}
    <text x={gx(R) - 3} y={gy(0) - 6} text-anchor="end" font-size="12" font-style="italic" font-weight="500" fill="var(--qx-text-2)" font-family="var(--qx-font)">x</text>
    <text x={gx(0) + 8} y={gy(R) + 8} text-anchor="start" font-size="12" font-style="italic" font-weight="500" fill="var(--qx-text-2)" font-family="var(--qx-font)">y</text>
  {/if}

  <!-- route trace -->
  {#if tracePath}
    <path d={tracePath} fill="none" stroke="var(--qx-accent)" stroke-width="2" stroke-dasharray="5,4" stroke-linecap="round" stroke-linejoin="round" />
  {/if}

  <!-- signals -->
  {#each signals as s}
    <g class="signal" class:found={s.found} opacity={s.faint ? 0.55 : 1}>
      <circle cx={gx(s.x)} cy={gy(s.y)} r={s.found ? 6 : 5}
        fill={s.found ? 'var(--qx-green)' : 'var(--qx-danger)'}
        stroke="var(--qx-surface-elevated)" stroke-width="2" />
      {#if s.label}
        <text x={gx(s.x)} y={gy(s.y) - 9} text-anchor="middle" font-size="8.5" font-weight="500"
          fill="var(--qx-text)" font-family="var(--qx-font)">{s.label}{#if mode === 'formal'} ({s.x}, {s.y}){/if}</text>
      {/if}
    </g>
  {/each}

  <!-- home marker -->
  <circle cx={gx(0)} cy={gy(0)} r="7" fill="none" stroke="var(--qx-text-2)" stroke-width="1.6" />
  <circle cx={gx(0)} cy={gy(0)} r="2.4" fill="var(--qx-text-2)" />
  {#if mode === 'formal'}
    <text x={gx(0) - 8} y={gy(0) + 14} text-anchor="end" font-size="8.5" font-weight="500" fill="var(--qx-text-dim)" font-family="var(--qx-font)">origin (0, 0)</text>
  {/if}

  <!-- drone -->
  {#if drone}
    <g class="drone">
      <circle cx={gx(drone.x)} cy={gy(drone.y)} r="8" fill="var(--qx-accent-soft)" stroke="var(--qx-accent)" stroke-width="1.6" />
      <circle cx={gx(drone.x)} cy={gy(drone.y)} r="3" fill="var(--qx-accent)" />
    </g>
  {/if}
</svg>

<style>
  .signal-grid { display: block; width: 100%; max-width: 300px; margin: 0 auto; border-radius: var(--qx-radius-md); }
  .drone { transition: transform .3s ease; }
  .signal circle { transition: fill .2s ease; }
  @media (prefers-reduced-motion: reduce) {
    .drone { transition: none; }
  }
</style>
