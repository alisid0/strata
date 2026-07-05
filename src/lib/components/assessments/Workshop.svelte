<script>
  // Workshop — steps through interactive assessment interactions
  import { fade, fly } from 'svelte/transition';
  import SortingDesk from './SortingDesk.svelte';
  import TapErase from './TapErase.svelte';
  // MCQ-style scenario picker is inline

  export let interactions = []; // [{ type: 'sorting'|'taperase'|'scenario', ...props }]
  export let onDone = () => {}; // (score, total) => void

  let step = 0;
  let totalScore = 0;
  let totalMax = 0;

  function handleInteractionDone(score, max) {
    totalScore += score;
    totalMax += max;
    if (step < interactions.length - 1) {
      step++;
    } else {
      onDone(totalScore, totalMax);
    }
  }

  $: current = interactions[step];
</script>

<div class="workshop">
  <div class="workshop-header">
    <span class="workshop-title">Workshop</span>
    <span class="workshop-progress">{step + 1} / {interactions.length}</span>
  </div>

  <div class="workshop-body" in:fly={{ x: 40, duration: 280 }} out:fly={{ x: -40, duration: 200 }}>
    {#if current}
      {#if current.type === 'sorting'}
        <SortingDesk boxes={current.boxes} items={current.items} onDone={handleInteractionDone} />
      {:else if current.type === 'taperase'}
        <TapErase onDone={handleInteractionDone} />
      {:else if current.type === 'scenario'}
        <div class="scenario">
          <div class="scenario-prompt">{current.prompt}</div>
          {#if current.image}
            <div class="scenario-image">{current.image}</div>
          {/if}
          <div class="scenario-options">
            {#each current.options as opt}
              <button
                class="scenario-opt"
                class:selected={current._answered}
                class:correct={current._answered && opt.correct}
                class:incorrect={current._answered && current._chosen === opt.id && !opt.correct}
                on:click={() => {
                  if (current._answered) return;
                  current._answered = true;
                  current._chosen = opt.id;
                  current._feedback = opt.correct ? current.correctFeedback : current.incorrectFeedback;
                  current._correct = opt.correct;
                  interactions = [...interactions];
                }}
              >
                {opt.label}
                {#if current._answered && opt.correct}<span class="check"> ✓</span>{/if}
                {#if current._answered && current._chosen === opt.id && !opt.correct}<span class="check"> ✗</span>{/if}
              </button>
            {/each}
          </div>
          {#if current._answered}
            <div class="scenario-feedback" class:correct={current._correct} class:incorrect={!current._correct}>
              {current._feedback}
            </div>
            <button class="continue-btn" on:click={() => handleInteractionDone(current._correct ? 1 : 0, 1)}>Continue</button>
          {/if}
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  .workshop {
    display: flex; flex-direction: column; width: 100%;
  }
  .workshop-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 20px;
  }
  .workshop-title {
    font-size: 18px; font-weight: 800; color: var(--qx-text);
  }
  .workshop-progress {
    font-size: 13px; font-weight: 700; color: var(--qx-text-faint);
  }
  .workshop-body { flex: 1; }
  .scenario {
    display: flex; flex-direction: column; gap: 16px; align-items: center;
    width: 100%; max-width: 360px; margin: 0 auto;
  }
  .scenario-prompt {
    font-size: 15px; font-weight: 700; color: var(--qx-text);
    text-align: center; line-height: 1.5;
  }
  .scenario-options { display: flex; flex-direction: column; gap: 8px; width: 100%; }
  .scenario-opt {
    padding: 12px 14px; border-radius: 10px; border: 1.5px solid var(--qx-border-2);
    background: var(--qx-surface); font-family: var(--qx-font);
    font-size: 14px; font-weight: 700; color: var(--qx-text); cursor: pointer;
    text-align: left; transition: border-color 0.15s;
  }
  .scenario-opt:hover { border-color: var(--qx-accent); }
  .scenario-opt.selected { pointer-events: none; }
  .scenario-opt.correct { border-color: var(--qx-green); background: var(--qx-green-soft); color: var(--qx-green-text); }
  .scenario-opt.incorrect { border-color: var(--qx-danger); background: var(--qx-danger-soft); color: var(--qx-danger-text); }
  .check { float: right; }
  .scenario-feedback {
    font-size: 13px; font-weight: 600; padding: 12px; border-radius: 8px;
    text-align: center; line-height: 1.5; width: 100%; box-sizing: border-box;
  }
  .scenario-feedback.correct { background: var(--qx-green-soft); color: var(--qx-green-text); }
  .scenario-feedback.incorrect { background: var(--qx-danger-soft); color: var(--qx-danger-text); }
  .continue-btn {
    padding: 12px 32px; border-radius: 24px; border: none;
    background: var(--qx-accent); color: #fff;
    font-family: var(--qx-font); font-size: 14px; font-weight: 800; cursor: pointer;
  }
</style>
