<script>
  // Scalable subject glyphs on a warm brand tile. Replaces the raster
  // pixel-art-on-navy icons: theme-aware, sharp at any size, and inside the
  // locked palette (Clay on Canvas), per the media rule that technical marks
  // must be SVG rather than raster.
  export let subject = 'physics';
  export let accent = ''; // kept for API compatibility; the mark uses the brand accent
  export let size = 32;

  // Accepts a subject key, a gateway key, or an icon path and resolves it.
  const ALIASES = [
    ['bit', 'computing'], ['comput', 'computing'],
    ['line', 'maths'], ['math', 'maths'],
    ['atom', 'chemistry'], ['chem', 'chemistry'],
    ['unit', 'physics'], ['phys', 'physics']
  ];
  function resolve(value) {
    const key = String(value || '').toLowerCase();
    for (const [needle, name] of ALIASES) if (key.includes(needle)) return name;
    return 'physics';
  }
  $: kind = resolve(subject);
</script>

<span class="subject-mark" style={`--sm:${size}px`} role="img" aria-label={kind}>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    {#if kind === 'physics'}
      <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="9.4" ry="3.9" />
      <ellipse cx="12" cy="12" rx="9.4" ry="3.9" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9.4" ry="3.9" transform="rotate(120 12 12)" />
    {:else if kind === 'maths'}
      <path d="M5 4 V19 H20" />
      <path d="M6.5 16.5 C 10 9 13 8 19 6" />
    {:else if kind === 'chemistry'}
      <path d="M9.5 3.5 H14.5" />
      <path d="M10.6 3.5 V9 L6 17.6 A2 2 0 0 0 7.8 20.5 H16.2 A2 2 0 0 0 18 17.6 L13.4 9 V3.5" />
      <path d="M8.2 15 H15.8" />
    {:else}
      <rect x="3.5" y="5" width="17" height="14" rx="2.6" />
      <path d="M7 10 L10 12.5 L7 15" />
      <path d="M12.6 15 H16.2" />
    {/if}
  </svg>
</span>

<style>
  .subject-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--sm);
    height: var(--sm);
    border-radius: clamp(9px, calc(var(--sm) * 0.26), 16px);
    background: color-mix(in srgb, var(--qx-accent) 12%, var(--qx-surface));
    border: 1px solid color-mix(in srgb, var(--qx-accent) 22%, transparent);
    color: var(--qx-accent);
    box-sizing: border-box;
    flex: 0 0 auto;
  }
  .subject-mark svg { width: 66%; height: 66%; display: block; }
</style>
