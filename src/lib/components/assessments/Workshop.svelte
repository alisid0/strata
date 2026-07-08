<script>
  // Workshop — steps through interactive assessment interactions
  import { fly } from 'svelte/transition';
  import SortingDesk from './SortingDesk.svelte';
  import TapErase from './TapErase.svelte';
  import BitPattern from './BitPattern.svelte';
  import PixelGrid from './PixelGrid.svelte';
  import ForceBalance from './ForceBalance.svelte';
  import WaveTuner from './WaveTuner.svelte';
  import AtomBuilder from './AtomBuilder.svelte';
  import MoleculeBuilder from './MoleculeBuilder.svelte';
  import MatrixCellFinder from './MatrixCellFinder.svelte';
  import MatrixTransform from './MatrixTransform.svelte';
  import CoordinateDrill from './CoordinateDrill.svelte';
  // MCQ-style scenario picker is inline

  export let interactions = []; // [{ type: 'sorting'|'taperase'|'scenario', ...props }]
  export let onDone = () => {}; // (score, total) => void

  let step = 0;
  let totalScore = 0;
  let totalMax = 0;

  function shuffle(items = []) {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function shuffledOptions(interaction) {
    if (!interaction?._shuffledOptions) {
      interaction._shuffledOptions = shuffle(interaction.options || []);
    }
    return interaction._shuffledOptions;
  }

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
  $: progressPct = interactions.length ? ((step + 1) / interactions.length) * 100 : 0;
  $: scenarioOptions = current?.type === 'scenario' ? shuffledOptions(current) : [];
</script>

<div class="workshop">
  <div class="workshop-header">
    <div>
      <span class="workshop-kicker">Micro drill</span>
      <span class="workshop-title">Workshop</span>
    </div>
    <span class="workshop-progress">{step + 1}/{interactions.length}</span>
  </div>
  <div class="progress-track" aria-hidden="true">
    <span style={`width:${progressPct}%`}></span>
  </div>

  <div class="workshop-body" in:fly={{ x: 40, duration: 220 }} out:fly={{ x: -40, duration: 160 }}>
    {#if current}
      {#if current.type === 'sorting'}
        <SortingDesk boxes={current.boxes} items={current.items} onDone={handleInteractionDone} />
      {:else if current.type === 'taperase'}
        <TapErase onDone={handleInteractionDone} />
      {:else if current.type === 'bitpattern'}
        <BitPattern
          prompt={current.prompt}
          bits={current.bits}
          target={current.target}
          labels={current.labels || []}
          correctFeedback={current.correctFeedback}
          incorrectFeedback={current.incorrectFeedback}
          onDone={handleInteractionDone}
        />
      {:else if current.type === 'pixelgrid'}
        <PixelGrid
          prompt={current.prompt}
          target={current.target}
          correctFeedback={current.correctFeedback}
          incorrectFeedback={current.incorrectFeedback}
          onDone={handleInteractionDone}
        />
      {:else if current.type === 'forcebalance'}
        <ForceBalance
          prompt={current.prompt}
          target={current.target}
          startLeft={current.startLeft}
          startRight={current.startRight}
          correctFeedback={current.correctFeedback}
          incorrectFeedback={current.incorrectFeedback}
          onDone={handleInteractionDone}
        />
      {:else if current.type === 'wavetuner'}
        <WaveTuner
          prompt={current.prompt}
          targetAmplitude={current.targetAmplitude}
          targetFrequency={current.targetFrequency}
          correctFeedback={current.correctFeedback}
          incorrectFeedback={current.incorrectFeedback}
          onDone={handleInteractionDone}
        />
      {:else if current.type === 'atombuilder'}
        <AtomBuilder
          prompt={current.prompt}
          targetName={current.targetName}
          targetProtons={current.targetProtons}
          targetNeutrons={current.targetNeutrons}
          targetElectrons={current.targetElectrons}
          correctFeedback={current.correctFeedback}
          incorrectFeedback={current.incorrectFeedback}
          onDone={handleInteractionDone}
        />
      {:else if current.type === 'moleculebuilder'}
        <MoleculeBuilder
          prompt={current.prompt}
          targetFormula={current.targetFormula}
          targetAtoms={current.targetAtoms}
          correctFeedback={current.correctFeedback}
          incorrectFeedback={current.incorrectFeedback}
          onDone={handleInteractionDone}
        />
      {:else if current.type === 'matrixcell'}
        <MatrixCellFinder
          prompt={current.prompt}
          matrix={current.matrix}
          targetRow={current.targetRow}
          targetCol={current.targetCol}
          correctFeedback={current.correctFeedback}
          incorrectFeedback={current.incorrectFeedback}
          onDone={handleInteractionDone}
        />
      {:else if current.type === 'matrixtransform'}
        <MatrixTransform
          prompt={current.prompt}
          matrix={current.matrix}
          inputPoint={current.inputPoint}
          options={current.options}
          correctFeedback={current.correctFeedback}
          incorrectFeedback={current.incorrectFeedback}
          onDone={handleInteractionDone}
        />
      {:else if current.type === 'coorddrill'}
        <CoordinateDrill
          mode={current.mode}
          prompt={current.prompt}
          targetX={current.targetX}
          targetY={current.targetY}
          targetM={current.targetM}
          targetC={current.targetC}
          fixedPoint={current.fixedPoint}
          targetDistance={current.targetDistance}
          distanceTolerance={current.distanceTolerance}
          pointA={current.pointA}
          pointB={current.pointB}
          xRange={current.xRange}
          yRange={current.yRange}
          correctFeedback={current.correctFeedback}
          incorrectFeedback={current.incorrectFeedback}
          onDone={handleInteractionDone}
        />
      {:else if current.type === 'scenario'}
        <div class="scenario">
          <div class="scenario-prompt">{current.prompt}</div>
          {#if current.image}
            <div class="scenario-image">{current.image}</div>
          {/if}
          <div class="scenario-options">
            {#each scenarioOptions as opt}
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
    gap: 14px; margin-bottom: 8px;
  }
  .workshop-kicker {
    display: block;
    font-size: 10px;
    line-height: 1.1;
    font-weight: 850;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--qx-accent);
    margin-bottom: 3px;
  }
  .workshop-title {
    display: block;
    font-size: 18px; font-weight: 850; color: var(--qx-text);
  }
  .workshop-progress {
    font-size: 12px; font-weight: 850; color: var(--qx-text-faint);
    font-variant-numeric: tabular-nums;
    border: 1px solid var(--qx-border);
    border-radius: 999px;
    padding: 5px 9px;
    background: var(--qx-surface-2);
  }
  .progress-track {
    height: 5px;
    width: 100%;
    border-radius: 999px;
    background: var(--qx-surface-2);
    overflow: hidden;
    margin-bottom: 18px;
  }
  .progress-track span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--qx-accent);
    transition: width 0.22s ease;
  }
  .workshop-body { flex: 1; min-height: 360px; }
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
