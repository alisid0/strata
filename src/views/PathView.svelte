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

  const STATE_BADGE = {
    mastered_2: '★', mastered_1: '★',
    recalled: '↻', well_read: '✓',
    checked: '✓', wandered: '·',
    unwandered: ''
  };

  // Get progress for individual cards
  $: cardStates = cards.map(c => {
    const bs = progress.getBoardState(c.number);
    return { ...c, state: bs.state, stateColor: STATE_COLOR[bs.state], stateBadge: STATE_BADGE[bs.state] };
  });

  // Find first unread or next board
  $: nextBoardNumber = cardStates.find(c => c.state === 'unwandered' || c.state === 'wandered')?.number
    || cardStates.find(c => c.state === 'checked')?.number
    || cards[0]?.number;

  $: boardsCompleted = cardStates.filter(c => c.state !== 'unwandered' && c.state !== 'wandered').length;

  $: hasQuiz = !!(manifest && manifest.quizUrls && manifest.quizUrls.length);
</script>

{#if manifest && state}
  <div class="qx-shell topic-detail-view">
    <div class="topbar">
      <button class="back-chev" on:click={() => onNavigate?.('topics')}>‹</button>
      <span class="topbar-subject">{manifest.subject === 'physics' ? 'Physics' : manifest.subject === 'maths' ? 'Mathematics' : 'Chemistry'}</span>
    </div>

    <div class="topic-header">
      <span class="mark-wrap"><SubjectMark subject={manifest.subject} accent={STATE_COLOR[state.state]} size={40} /></span>
      <div class="header-info">
        <div class="state-chip" style="color:{STATE_COLOR[state.state]}; background:{STATE_COLOR[state.state]}18">{state.label}</div>
        <h1>{manifest.name}</h1>
        <div class="progress-line">
          <span>{state.boardsRead} of {state.boardsTotal} boards read</span>
          <span class="pct">{pct}%</span>
        </div>
        <div class="meter"><div class="meter-fill" style="width:{pct}%; background:{STATE_COLOR[state.state]}"></div></div>
      </div>
    </div>

    {#if state.bestScore != null}
      <div class="best-score">Best quiz: {state.bestScore}/{state.bestTotal}</div>
    {/if}

    {#if loading}
      <div class="loading-row">Loading boards…</div>
    {:else}
      <div class="board-list">
        {#each cardStates as c, i}
          <button class="board-row" class:done={c.stateBadge === '✓' || c.stateBadge === '★' || c.stateBadge === '↻'} on:click={() => openReader(c.number)}>
            <span class="row-num" style="background:{c.stateColor}18; color:{c.stateColor}">
              {#if c.stateBadge === '✓' || c.stateBadge === '★' || c.stateBadge === '↻'}
                {c.stateBadge}
              {:else}
                {i + 1}
              {/if}
            </span>
            <div class="row-info">
              <div class="row-title">{c.board.title || 'Untitled'}</div>
              <div class="row-kicker">{c.board.kicker || ''}</div>
            </div>
            {#if c.number === nextBoardNumber}
              <span class="row-tag">Next</span>
            {:else}
              <span class="row-chev">›</span>
            {/if}
          </button>
        {/each}
      </div>

      <div class="footer">
        <button class="cta-primary" on:click={() => openReader(nextBoardNumber)}>
          Continue · Board {cards.findIndex(c => c.number === nextBoardNumber) + 1}
        </button>
        {#if hasQuiz}
          <button class="cta-secondary" on:click={() => onNavigate?.('quiz', pathId)}>
            Take the quiz
            {#if state.bestScore != null}<span class="cta-score">Best {state.bestScore}/{state.bestTotal}</span>{/if}
          </button>
        {/if}
      </div>
    {/if}
  </div>
{/if}

<style>
  .topic-detail-view { height: 100%; overflow-y: auto; padding: 16px 18px 24px; box-sizing: border-box; }

  .topbar { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
  .back-chev {
    width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid var(--qx-border-2); background: var(--qx-surface);
    color: var(--qx-text-dim); font-size: 19px; cursor: pointer; display: flex; align-items: center; justify-content: center;
  }
  .topbar-subject { font-size: 14px; font-weight: 700; color: var(--qx-text-dim); }

  .topic-header { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 20px; }
  .mark-wrap { flex-shrink: 0; margin-top: 4px; }
  .header-info { flex: 1; min-width: 0; }
  .state-chip {
    display: inline-block; font-size: 11px; font-weight: 800; border-radius: var(--qx-radius-pill);
    padding: 3px 10px; margin-bottom: 6px;
  }
  h1 { font-size: 21px; font-weight: 800; color: var(--qx-text); margin: 0 0 6px; line-height: 1.2; letter-spacing: -0.01em; }
  .progress-line { display: flex; align-items: baseline; gap: 8px; margin-bottom: 6px; }
  .progress-line span { font-size: 13px; font-weight: 600; color: var(--qx-text-dim); }
  .pct { font-weight: 800; color: var(--qx-text); }
  .meter { height: 5px; border-radius: 3px; background: var(--qx-border-2); overflow: hidden; }
  .meter-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }

  .best-score { font-size: 13px; font-weight: 600; color: var(--qx-text-faint); margin-bottom: 16px; }

  .board-list { display: flex; flex-direction: column; gap: 2px; margin-bottom: 20px; }
  .board-row {
    display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: var(--qx-radius-md);
    border: none; background: transparent; cursor: pointer; text-align: left; font-family: var(--qx-font);
    transition: background 0.1s;
  }
  .board-row:hover { background: var(--qx-surface); }
  .board-row.done { opacity: 0.62; }
  .row-num {
    width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 800; flex-shrink: 0;
  }
  .row-info { flex: 1; min-width: 0; }
  .row-title { font-size: 14px; font-weight: 700; color: var(--qx-text); line-height: 1.3; }
  .row-kicker { font-size: 12px; font-weight: 500; color: var(--qx-text-faint); margin-top: 1px; }
  .row-tag { font-size: 11px; font-weight: 700; color: var(--qx-accent-text); background: var(--qx-accent-soft); border-radius: var(--qx-radius-pill); padding: 3px 10px; }
  .row-chev { font-size: 18px; color: var(--qx-text-faintest); }

  .footer { display: flex; flex-direction: column; gap: 10px; }
  .cta-primary {
    width: 100%; padding: 14px; border-radius: var(--qx-radius-md); border: none;
    background: var(--qx-accent); color: #fff; font-family: var(--qx-font); font-size: 16px; font-weight: 800;
    cursor: pointer; text-align: center;
  }
  .cta-secondary {
    width: 100%; padding: 13px; border-radius: var(--qx-radius-md); border: 1.5px solid var(--qx-border-2);
    background: var(--qx-surface); color: var(--qx-text); font-family: var(--qx-font); font-size: 15px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .cta-score { font-weight: 600; color: var(--qx-text-dim); font-size: 13px; }

  .loading-row { text-align: center; color: var(--qx-text-faint); padding: 32px 0; font-size: 14px; }
</style>
