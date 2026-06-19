<script>
  import { DECK } from '../lib/content/deck.js';
  import { PATHS } from '../lib/content/paths.js';
  import { progress } from '../lib/stores/progress.js';
  import SubjectMark from '../lib/components/SubjectMark.svelte';
  import ChalkButton from '../lib/components/ChalkButton.svelte';

  export let pathId = '';
  export let onNavigate; // (view, args?) => void

  $: manifest = PATHS[pathId];
  $: state = manifest ? progress.getPathState(pathId, manifest) : null;
  $: cards = manifest ? manifest.cards.map(n => DECK[n - 1]).filter(Boolean) : [];

  const STATE_COLORS = {
    unwandered: '', wandered: '', checked: 'var(--chalk-yellow)',
    well_read: 'var(--chalk-green)', recalled: 'var(--chalk-blue)',
    mastered_1: 'var(--chalk-yellow)', mastered_2: 'var(--chalk-yellow)'
  };
</script>

{#if manifest && state}
  <div class="path-view">
    <button class="back-link" on:click={() => onNavigate?.('subjects')}>‹ all subjects</button>

    <div class="path-header">
      <SubjectMark subject={manifest.subject} accent="#f2d585" size={36} />
      <div>
        <h1>{manifest.name}</h1>
        <div class="path-sub">{state.boardsRead} of {state.boardsTotal} boards · {state.label}</div>
      </div>
    </div>

    <div class="state-chip" style="border-color:{STATE_COLORS[state.state] || 'var(--chalk-faint)'};color:{STATE_COLORS[state.state] || 'var(--chalk-faint)'}">
      {state.label}
    </div>

    {#if state.bestScore != null}
      <div class="best-score">
        Best quiz: {state.bestScore}/{state.bestTotal}
      </div>
    {/if}

    <div class="card-list">
      {#each cards as card, i}
        <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
        <div class="path-card" on:click={() => onNavigate?.('reader', manifest.cards[i] - 1)} role="button" tabindex="0">
          <div class="card-num">{manifest.cards[i]}</div>
          <div class="card-info">
            <div class="card-title">{card?.title || 'Untitled'}</div>
            <div class="card-kicker">{card?.kicker || ''}</div>
          </div>
          <div class="card-chev">›</div>
        </div>
      {/each}
    </div>

    <div class="quiz-section">
      <h2>Test yourself</h2>
      <ChalkButton fullWidth on:click={() => onNavigate?.('quiz', pathId)}>
        Start quiz ({manifest.quizUrls?.length || '12'} questions)
      </ChalkButton>
    </div>
  </div>
{/if}

<style>
  .path-view {
    height: 100%;
    overflow-y: auto;
    padding: 24px 18px 100px;
    background: var(--board-1);
    border: 12px solid var(--frame);
    border-radius: 6px;
    box-shadow: 0 0 0 2px var(--frame-dark), 0 30px 70px -28px rgba(0,0,0,0.85), inset 0 0 80px rgba(0,0,0,0.35);
  }
  .back-link {
    font-family: var(--print); font-size: 13px; color: var(--chalk-faint);
    text-decoration: none; margin-bottom: 16px; display: inline-block;
    cursor: pointer; background: none; border: none;
  }
  .path-header {
    display: flex; align-items: center; gap: 14px; margin-bottom: 14px;
  }
  .path-header h1 {
    font-family: var(--hand-display); font-weight: 400;
    font-size: 24px; margin-bottom: 2px;
  }
  .path-sub { font-family: var(--print); font-size: 13px; color: var(--chalk-faint); }
  .state-chip {
    display: inline-block;
    font-family: var(--print); font-size: 12px;
    border: 1.5px dashed; border-radius: 14px;
    padding: 3px 12px; margin-bottom: 16px;
  }
  .best-score {
    font-family: var(--print); font-size: 13px; color: var(--chalk-green);
    margin-bottom: 14px;
  }
  .card-list {
    display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px;
  }
  .path-card {
    display: flex; align-items: center; gap: 12px;
    background: rgba(0,0,0,0.14);
    border: 1.5px dashed rgba(244,241,233,0.12);
    border-radius: 10px; padding: 10px 12px; cursor: pointer;
  }
  .path-card:active { background: rgba(0,0,0,0.25); }
  .card-num {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--board-2); border: 1.5px dashed var(--chalk-faint);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--print); font-size: 13px; color: var(--chalk-dim); flex-shrink: 0;
  }
  .card-info { flex: 1; min-width: 0; }
  .card-title { font-family: var(--hand); font-size: 15px; color: var(--chalk); }
  .card-kicker { font-family: var(--print); font-size: 12px; color: var(--chalk-faint); }
  .card-chev { color: var(--chalk-faint); font-size: 16px; }
  .quiz-section {
    border-top: 1.5px dashed var(--line);
    padding-top: 20px;
  }
  .quiz-section h2 {
    font-family: var(--hand-display); font-weight: 400;
    font-size: 20px; margin-bottom: 12px;
  }
</style>
