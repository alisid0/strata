<script>
  import { flip } from 'svelte/animate';
  import { fly, fade } from 'svelte/transition';
  import { PATHS, SUBJECT_LABELS, totalBoards } from '../lib/content/paths.js';
  import { progress } from '../lib/stores/progress.js';
  import SubjectMark from '../lib/components/SubjectMark.svelte';

  export let onNavigate;

  let filter = 'all'; // all | physics | maths | chemistry
  let viewMode = 'list'; // list | grid
  let searchQuery = '';

  const STATE_COLOR = {
    unwandered: 'var(--qx-text-faintest)', wandered: 'var(--qx-text-faint)',
    checked: 'var(--qx-yellow)', well_read: 'var(--qx-green)',
    recalled: 'var(--qx-accent)', mastered_1: 'var(--qx-pink)', mastered_2: 'var(--qx-pink)'
  };

  const STATE_BADGE = {
    mastered_2: '★', mastered_1: '★',
    recalled: '↻', well_read: '✓',
    checked: '✓', wandered: '+',
    unwandered: '+'
  };

  const STATE_LABEL = {
    mastered_2: 'Mastered ×2', mastered_1: 'Mastered',
    recalled: 'Recalled', well_read: 'Well read',
    checked: 'Checked', wandered: 'Start',
    unwandered: 'Start · new'
  };

  $: allEntries = Object.entries(PATHS)
    .map(([id, manifest]) => ({ id, manifest, state: progress.getPathState(id, manifest) }))
    .filter(p => filter === 'all' || p.manifest.subject === filter);

  $: entries = searchQuery.trim()
    ? allEntries.filter(p => p.manifest.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : allEntries;

  $: readCount = allEntries.filter(p => p.state.boardsRead > 0).length;
  $: totalCount = allEntries.length;

  const FILTERS = ['all', 'physics', 'maths', 'chemistry'];
</script>

<div class="qx-shell topics-view">
  <div class="topics-header">
    <div class="header-row">
      <h1>Topics</h1>
      <span class="read-count">{readCount} / {totalCount} read</span>
    </div>
    <div class="tools-row">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input class="search-input" type="text" placeholder="Search a topic" bind:value={searchQuery} />
      </div>
      <div class="view-toggle">
        <button class="vt-btn" class:active={viewMode === 'list'} on:click={() => viewMode = 'list'} title="List view">☰</button>
        <button class="vt-btn" class:active={viewMode === 'grid'} on:click={() => viewMode = 'grid'} title="Grid view">⊞</button>
      </div>
    </div>
  </div>

  <div class="pill-row">
    {#each FILTERS as f}
      <button class="pill" class:active={filter === f} on:click={() => filter = f}>
        {f === 'all' ? 'All' : SUBJECT_LABELS[f]}
      </button>
    {/each}
  </div>

  {#if viewMode === 'list'}
    <!-- Variation A: List view with state badges -->
    <div class="list">
      {#each entries as p, i (p.id)}
        <button class="list-row" on:click={() => onNavigate?.('topicDetail', p.id)}
          animate:flip={{ duration: 300 }}
          in:fly={{ x: -30, delay: i * 40, duration: 250, easing: t => t<.5 ? 2*t*t : -1+(4-2*t)*t }}>
          <span class="state-badge badge-{p.state.state}" title={STATE_LABEL[p.state.state]}>
            {#if p.state.state === 'unwandered'}
              <SubjectMark subject={p.manifest.subject} accent={STATE_COLOR[p.state.state]} size={20} />
            {:else}
              {STATE_BADGE[p.state.state]}
            {/if}
          </span>
          <div class="list-info">
            <div class="list-name">{p.manifest.name}</div>
            <div class="list-meta">{p.manifest.subject === 'physics' ? 'Physics' : p.manifest.subject === 'maths' ? 'Maths' : 'Chemistry'} · {p.state.boardsTotal} boards{#if p.state.state === 'unwandered'} · new{/if}</div>
          </div>
          <span class="list-state-label">{STATE_LABEL[p.state.state]}</span>
        </button>
      {/each}
    </div>
  {:else}
    <!-- Variation B: Grid view with state rings -->
    <div class="grid">
      {#each entries as p, i (p.id)}
        <button class="topic-card" on:click={() => onNavigate?.('topicDetail', p.id)}
          animate:flip={{ duration: 300 }}
          in:fly={{ y: 20, delay: i * 50, duration: 280, easing: t => t<.5 ? 2*t*t : -1+(4-2*t)*t }}>
          <div class="card-top">
            <span class="mark-wrap"><SubjectMark subject={p.manifest.subject} accent={STATE_COLOR[p.state.state]} size={26} /></span>
            <span class="state-dot" style="background:{STATE_COLOR[p.state.state]}">{STATE_BADGE[p.state.state]}</span>
          </div>
          <div class="topic-name">{p.manifest.name}</div>
          <div class="topic-meta">{p.state.boardsRead} / {p.state.boardsTotal} · {p.state.label}</div>
          <div class="meter"><div class="meter-fill" style="width:{p.state.boardsTotal ? (p.state.boardsRead / p.state.boardsTotal) * 100 : 0}%; background:{STATE_COLOR[p.state.state]}"></div></div>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .topics-view { height: 100%; overflow-y: auto; padding: 16px 18px 20px; box-sizing: border-box; }

  .topics-header { margin-bottom: 14px; }
  .header-row { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 10px; }
  h1 { font-size: 23px; font-weight: 800; color: var(--qx-text); margin: 4px 0 0; }
  .read-count { font-size: 13px; font-weight: 700; color: var(--qx-text-dim); }

  .tools-row { display: flex; gap: 8px; align-items: center; }
  .search-wrap {
    flex: 1; display: flex; align-items: center; gap: 8px; background: var(--qx-surface);
    border: 1.5px solid var(--qx-border-2); border-radius: var(--qx-radius-pill); padding: 0 14px;
  }
  .search-icon { font-size: 14px; opacity: 0.5; }
  .search-input {
    flex: 1; border: none; background: transparent; padding: 10px 0; font-family: var(--qx-font);
    font-size: 14px; color: var(--qx-text); outline: none;
  }
  .search-input::placeholder { color: var(--qx-text-faint); }

  .view-toggle { display: flex; background: var(--qx-surface); border-radius: var(--qx-radius-pill); border: 1.5px solid var(--qx-border-2); overflow: hidden; }
  .vt-btn {
    width: 36px; height: 36px; border: none; background: transparent; cursor: pointer; font-size: 16px;
    color: var(--qx-text-faint); transition: all 0.15s; display: flex; align-items: center; justify-content: center;
  }
  .vt-btn.active { background: var(--qx-accent); color: #fff; }

  .pill-row { display: flex; gap: 8px; margin-bottom: 16px; overflow-x: auto; }
  .pill {
    font-size: 13px; font-weight: 700; color: var(--qx-text-2); background: var(--qx-surface);
    border: 1.5px solid var(--qx-border-2); border-radius: var(--qx-radius-pill); padding: 7px 14px;
    cursor: pointer; font-family: var(--qx-font); white-space: nowrap; flex-shrink: 0;
  }
  .pill.active { color: var(--qx-accent); background: var(--qx-accent-soft); border-color: var(--qx-accent); }

  /* ── List view ── */
  .list { display: flex; flex-direction: column; gap: 2px; }
  .list-row {
    display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: var(--qx-radius-md);
    border: none; background: transparent; cursor: pointer; text-align: left; font-family: var(--qx-font);
    transition: background 0.12s;
  }
  .list-row:hover { background: var(--qx-surface); }
  .state-badge {
    width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 900; flex-shrink: 0; background: var(--qx-surface-2); color: var(--qx-text-dim);
  }
  .badge-mastered_2, .badge-mastered_1 { background: var(--qx-pink-soft); color: var(--qx-pink-text); }
  .badge-recalled { background: var(--qx-accent-soft); color: var(--qx-accent-text); }
  .badge-well_read { background: var(--qx-green-soft); color: var(--qx-green-text); }
  .badge-checked { background: var(--qx-yellow-soft); color: var(--qx-yellow-text); }
  .badge-wandered { background: var(--qx-accent-soft-2); color: var(--qx-accent); }
  .badge-unwandered { background: var(--qx-surface-2); color: var(--qx-text-faint); }

  .list-info { flex: 1; min-width: 0; }
  .list-name { font-size: 15px; font-weight: 700; color: var(--qx-text); line-height: 1.3; }
  .list-meta { font-size: 12px; font-weight: 600; color: var(--qx-text-dim); margin-top: 2px; }
  .list-state-label { font-size: 12px; font-weight: 600; color: var(--qx-text-faint); white-space: nowrap; }

  /* ── Grid view ── */
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; }
  .topic-card {
    border: 1.5px solid var(--qx-border); background: var(--qx-surface); border-radius: var(--qx-radius-lg);
    padding: 13px; text-align: left; cursor: pointer; font-family: var(--qx-font);
    transition: border-color 0.15s;
  }
  .topic-card:hover { border-color: var(--qx-accent); }
  .card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .mark-wrap { color: var(--qx-text-2); }
  .state-dot {
    width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 900; color: #fff;
  }
  .topic-name { font-size: 13.5px; font-weight: 800; color: var(--qx-text); line-height: 1.2; margin-bottom: 5px; min-height: 32px; }
  .topic-meta { font-size: 11px; font-weight: 600; color: var(--qx-text-dim); margin-bottom: 7px; }
  .meter { height: 5px; border-radius: 3px; background: var(--qx-border-2); overflow: hidden; }
  .meter-fill { height: 100%; border-radius: 3px; }
</style>
