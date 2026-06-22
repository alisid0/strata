<script>
  import { PATHS, SUBJECT_LABELS } from '../lib/content/paths.js';
  import { progress } from '../lib/stores/progress.js';
  import SubjectMark from '../lib/components/SubjectMark.svelte';

  export let onNavigate;

  let filter = 'all'; // all | physics | maths | chemistry

  const STATE_COLOR = {
    unwandered: 'var(--qx-text-faintest)', wandered: 'var(--qx-text-faint)',
    checked: 'var(--qx-yellow)', well_read: 'var(--qx-green)',
    recalled: 'var(--qx-accent)', mastered_1: 'var(--qx-pink)', mastered_2: 'var(--qx-pink)'
  };

  $: entries = Object.entries(PATHS)
    .map(([id, manifest]) => ({ id, manifest, state: progress.getPathState(id, manifest) }))
    .filter(p => filter === 'all' || p.manifest.subject === filter);

  const FILTERS = ['all', 'physics', 'maths', 'chemistry'];
</script>

<div class="qx-shell topics-view">
  <h1>Topics</h1>

  <div class="pill-row">
    {#each FILTERS as f}
      <button class="pill" class:active={filter === f} on:click={() => filter = f}>
        {f === 'all' ? 'All' : SUBJECT_LABELS[f]}
      </button>
    {/each}
  </div>

  <div class="grid">
    {#each entries as p}
      <button class="topic-card" on:click={() => onNavigate?.('topicDetail', p.id)}>
        <div class="card-top">
          <span class="mark-wrap"><SubjectMark subject={p.manifest.subject} accent={STATE_COLOR[p.state.state]} size={26} /></span>
          <span class="state-dot" style="background:{STATE_COLOR[p.state.state]}"></span>
        </div>
        <div class="topic-name">{p.manifest.name}</div>
        <div class="topic-meta">{p.state.boardsRead} / {p.state.boardsTotal} · {p.state.label}</div>
        <div class="meter"><div class="meter-fill" style="width:{p.state.boardsTotal ? (p.state.boardsRead / p.state.boardsTotal) * 100 : 0}%; background:{STATE_COLOR[p.state.state]}"></div></div>
      </button>
    {/each}
  </div>
</div>

<style>
  .topics-view { height: 100%; overflow-y: auto; padding: 16px 18px 20px; box-sizing: border-box; }
  h1 { font-size: 23px; font-weight: 800; color: var(--qx-text); margin: 4px 0 14px; }

  .pill-row { display: flex; gap: 8px; margin-bottom: 16px; overflow-x: auto; }
  .pill {
    font-size: 13px; font-weight: 700; color: var(--qx-text-2); background: var(--qx-surface);
    border: 1.5px solid var(--qx-border-2); border-radius: var(--qx-radius-pill); padding: 7px 14px;
    cursor: pointer; font-family: var(--qx-font); white-space: nowrap; flex-shrink: 0;
  }
  .pill.active { color: var(--qx-accent); background: var(--qx-accent-soft); border-color: var(--qx-accent); }

  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; }
  .topic-card {
    border: 1.5px solid var(--qx-border); background: var(--qx-surface); border-radius: var(--qx-radius-lg);
    padding: 13px; text-align: left; cursor: pointer; font-family: var(--qx-font);
  }
  .card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .mark-wrap { color: var(--qx-text-2); }
  .state-dot { width: 8px; height: 8px; border-radius: 50%; }
  .topic-name { font-size: 13.5px; font-weight: 800; color: var(--qx-text); line-height: 1.2; margin-bottom: 5px; min-height: 32px; }
  .topic-meta { font-size: 11px; font-weight: 600; color: var(--qx-text-dim); margin-bottom: 7px; }
  .meter { height: 5px; border-radius: 3px; background: var(--qx-border-2); overflow: hidden; }
  .meter-fill { height: 100%; border-radius: 3px; }
</style>
