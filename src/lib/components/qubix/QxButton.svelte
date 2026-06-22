<script>
  export let variant = 'primary'; // primary | secondary | ghost
  export let fullWidth = true;
  export let disabled = false;
</script>

<button
  class="qx-btn {variant}"
  class:full={fullWidth}
  {disabled}
  on:click
>
  <slot />
</button>

<style>
  .qx-btn {
    font-family: var(--qx-font);
    font-size: 15px;
    font-weight: 800;
    border-radius: var(--qx-radius-md);
    border: none;
    cursor: pointer;
    min-height: 46px;
    padding: 0 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .qx-btn.full { width: 100%; }
  .qx-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .primary { background: var(--qx-accent); color: #ffffff; }
  .secondary {
    background: var(--qx-surface);
    color: var(--qx-text);
    border: 1.5px solid var(--qx-border-2);
  }
  .ghost {
    background: transparent;
    color: var(--qx-text-dim);
    border: 1.5px dashed var(--qx-border-2);
  }
</style>
