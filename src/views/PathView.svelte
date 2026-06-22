<script>
  import { onMount } from 'svelte';
  import { PATHS } from '../lib/content/paths.js';
  import { progress } from '../lib/stores/progress.js';
  import { getBoard, fetchBoardsByNumbers } from '../lib/content/dynamicBoards.js';
  import SubjectMark from '../lib/components/SubjectMark.svelte';
  import QxButton from '../lib/components/qubix/QxButton.svelte';

  export let pathId = '';
  export let onNavigate; // (view, args?) => void

  $: manifest = PATHS[pathId];
  $: state = manifest ? progress.getPathState(pathId, manifest) : null;
  $: pct = state && state.boardsTotal ? Math.round((state.boardsRead / state.boardsTotal) * 100) : 0;

  let loading = true;
  let cards = [];

  // This is the "user selects a topic" pull point: any card numbers beyond
  // the static deck get fetched from Supabase here, once, before the board
  // list (and later Reader.svelte) need them.
  $: if (manifest) loadCards(manifest.cards);

  async function loadCards(numbers) {
    loading = true;
    try {
      const resolved = await fetchBoardsByNumbers(numbers);
      cards = numbers.map(n => ({ number: n, board: resolved[n] })).filter(c => c.board);
    } finally {
      loading = false;
    }
  }

  function openReader(startNumber) {
    onNavigate?.('reader', { numbers: manifest.cards, start: startNumber });
  }

  const STATE_COLOR = {
    unwandered: 'var(--qx-text-faintest)', wandered: 'var(--qx-text-faint)',
    checked: 'var(--qx-yellow)', well_read: 'var(--qx-green)',
    recalled: 'var(--qx-accent)', mastered_1: 'var(--qx-pink)', mastered_2: 'var(--qx-pink)'
  };
</script>

{#if manifest && state}
  <div class="qx-shell topic-detail-view">
    <div class="topbar">
      <button class="back-chev" on:click={() => onNavigate?.('topics')}>‹</button>
      <span class="topbar-title">Topic Detail</span>
    </div>

    <div class="header-row">
      <span class="mark-wrap"><SubjectMark subject={manifest.subject} accent={STATE_COLOR[state.state]} size={36} /></span>
      <div>
        <h1>{manifest.name}</h1>
        <div class="sub">{state.boardsRead} of {state.boardsTotal} boards · {state.label}</div>
      </div>
    </div>

    <div class="meter"><div class="meter-fill" style="width:{pct}%; background:{STATE_COLOR[state.state]}"></div></div>

    {#if state.bestScore != null}
      <div class="best-score">Best quiz: {state.bestScore}/{state.bestTotal}</div>
    {/if}

    {#if loading}
      <div class="loading-row">Loading boards…</div>
    {:else}
      <div class="board-list">
        {#each cards as c}
          <button class="board-row" on:click={() => openReader(c.number)}>
            <div class="board-num">{c.number}</div>
            <div class="board-info">
              <div class="board-title">{c.board.title || 'Untitled'}</div>
              <div class="board-kicker">{c.board.kicker || ''}</div>
            </div>
            <div class="board-chev">›</div>
          </button>
        {/each}
      </div>

      <div class="footer">
        <QxButton variant="secondary" on:click={() => openReader(cards[0]?.number)}>Continue</QxButton>
        <QxButton variant="primary" on:click={() => onNavigate?.('quiz', pathId)}>Take quiz</QxButton>
      </div>
    {/if}
  </div>
{/if}

<style>
  .topic-detail-view { height: 100%; overflow-y: auto; padding: 16px 18px 24px; box-sizing: border-box; }

  .topbar { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
  .back-chev {
    width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid var(--qx-border-2); background: var(--qx-surface);
    color: var(--qx-text-dim); font-size: 19px; cursor: pointer; display: flex; align-items: center; justify-content: center;
  }
  .topbar-title { font-size: 13px; font-weight: 700; color: var(--qx-text-faint); }

  .header-row { display: flex; align-items: center; gap: 13px; margin-bottom: 12px; }
  .mark-wrap { color: var(--qx-text-2); flex-shrink: 0; }
  h1 { font-size: 20px; font-weight: 800; color: var(--qx-text); margin: 0 0 2px; }
  .sub { font-size: 13px; color: var(--qx-text-dim); }

  .meter { height: 6px; border-radius: 3px; background: var(--qx-border-2); overflow: hidden; margin-bottom: 10px; }
  .meter-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
  .best-score { font-size: 13px; font-weight: 700; color: var(--qx-green-text); margin-bottom: 14px; }
  .loading-row { font-size: 13px; font-weight: 600; color: var(--qx-text-faint); padding: 20px 0; text-align: center; }

  .board-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
  .board-row {
    display: flex; align-items: center; gap: 12px; width: 100%; text-align: left;
    background: var(--qx-surface); border: 1.5px solid var(--qx-border); border-radius: var(--qx-radius-md);
    padding: 10px 12px; cursor: pointer; font-family: var(--qx-font);
  }
  .board-num {
    width: 30px; height: 30px; border-radius: 50%; background: var(--qx-surface-2); border: 1.5px solid var(--qx-border-2);
    display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: var(--qx-text-dim); flex-shrink: 0;
  }
  .board-info { flex: 1; min-width: 0; }
  .board-title { font-size: 14px; font-weight: 700; color: var(--qx-text); }
  .board-kicker { font-size: 11px; font-weight: 600; color: var(--qx-text-faint); }
  .board-chev { color: var(--qx-text-faint); font-size: 16px; }

  .footer { display: flex; gap: 10px; padding-top: 4px; }
</style>
