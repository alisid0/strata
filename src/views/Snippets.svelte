<script>
  import { DECK } from '../lib/content/deck.js';
  import QxIcon from '../lib/components/qubix/QxIcon.svelte';

  export let onNavigate;

  // Only one snippet BB exists today (Card 55). Showing exactly what's authored,
  // not fabricating filler ones — this view will feel thin until more are written.
  const SNIPPETS = DECK.filter(c => c.tags?.kind === 'snippet');

  let index = 0;
  $: current = SNIPPETS[index];

  function shuffle() {
    if (SNIPPETS.length < 2) return;
    let next = index;
    while (next === index) next = Math.floor(Math.random() * SNIPPETS.length);
    index = next;
  }
</script>

<div class="qx-shell snippets-view">
  <div class="top-row">
    <h1>Snippets</h1>
    <button class="icon-btn" on:click={shuffle} disabled={SNIPPETS.length < 2}>
      <QxIcon name="shuffle" size={18} />
    </button>
  </div>
  <div class="sub">No pressure, no progress tracking. Just things worth knowing.</div>

  {#if current}
    <div class="snippet-card">
      <div class="snippet-kicker">{current.kicker}</div>
      <div class="snippet-title">{current.title}</div>
      <div class="snippet-body">{@html current.layers?.[0] || ''}</div>
    </div>
    {#if SNIPPETS.length > 1}
      <div class="pager">{index + 1} / {SNIPPETS.length}</div>
    {:else}
      <div class="pager">More snippets coming soon</div>
    {/if}
  {:else}
    <div class="empty">No snippets yet — check back soon.</div>
  {/if}
</div>

<style>
  .snippets-view { height: 100%; overflow-y: auto; padding: 16px 18px 24px; box-sizing: border-box; }
  .top-row { display: flex; align-items: center; justify-content: space-between; }
  h1 { font-size: 23px; font-weight: 800; color: var(--qx-text); margin: 0; }
  .icon-btn {
    width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid var(--qx-border-2); background: var(--qx-surface);
    color: var(--qx-text-dim); cursor: pointer; display: flex; align-items: center; justify-content: center;
  }
  .icon-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .sub { font-size: 13px; color: var(--qx-text-dim); margin: 4px 0 18px; }

  .snippet-card {
    border: 1.5px solid var(--qx-border); background: var(--qx-surface); border-radius: var(--qx-radius-lg);
    padding: 20px; margin-bottom: 12px;
  }
  .snippet-kicker { font-size: 11px; font-weight: 700; color: var(--qx-accent); letter-spacing: 0.05em; margin-bottom: 6px; }
  .snippet-title { font-size: 18px; font-weight: 800; color: var(--qx-text); margin-bottom: 12px; line-height: 1.25; }
  .snippet-body { font-size: 14px; color: var(--qx-text-2); line-height: 1.55; }
  .snippet-body :global(p) { margin-bottom: 10px; }

  .pager { text-align: center; font-size: 12px; font-weight: 600; color: var(--qx-text-faint); }
  .empty { text-align: center; color: var(--qx-text-dim); padding: 40px 0; }
</style>
