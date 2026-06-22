<script>
  export let padding = '14px';
  export let accentBorder = false; // highlight border in accent color
</script>

<div class="qx-card" class:accent={accentBorder} style="padding:{padding}">
  <slot />
</div>

<style>
  .qx-card {
    background: var(--qx-surface);
    border: 1.5px solid var(--qx-border);
    border-radius: var(--qx-radius-lg);
  }
  .qx-card.accent {
    border-color: var(--qx-accent);
    background: var(--qx-accent-soft-2);
  }
</style>
