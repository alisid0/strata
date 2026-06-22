<script>
  import QxButton from '../lib/components/qubix/QxButton.svelte';

  export let onComplete = () => {};

  let step = 1; // 1: how-heard + learner-type, 2: gesture tutorial
  const TOTAL_STEPS = 2;

  let heardFrom = '';
  let learnerType = '';

  const HEARD_OPTIONS = ['Friend', 'Social', 'Search', 'Other'];
  const LEARNER_TYPES = [
    { id: 'visual', label: 'Visual', sub: 'diagrams & maps' },
    { id: 'hands-on', label: 'Hands-on', sub: 'do, then learn' },
    { id: 'reader', label: 'Reader', sub: 'text & depth' },
    { id: 'social', label: 'Social', sub: 'compete & share' }
  ];

  function next() {
    if (step < TOTAL_STEPS) step++;
    else onComplete({ heardFrom, learnerType });
  }
  function back() {
    if (step > 1) step--;
  }
</script>

<div class="qx-shell onboarding-view">
  <div class="topbar">
    <span class="step-label">Step {step} of {TOTAL_STEPS}</span>
    <div class="dots">
      {#each Array(TOTAL_STEPS) as _, i}
        <div class="dot" class:filled={i < step}></div>
      {/each}
    </div>
  </div>

  {#if step === 1}
    <div class="content">
      <h2>A bit about you</h2>
      <p class="sub">This tailors what Qubix surfaces first.</p>

      <div class="fl">How did you hear about us?</div>
      <div class="pill-row">
        {#each HEARD_OPTIONS as opt}
          <button class="pill" class:active={heardFrom === opt} on:click={() => heardFrom = opt}>{opt}</button>
        {/each}
      </div>

      <div class="fl">What type of learner are you?</div>
      <div class="type-grid">
        {#each LEARNER_TYPES as t}
          <button class="type-card" class:active={learnerType === t.id} on:click={() => learnerType = t.id}>
            <div class="type-name">{t.label}</div>
            <div class="type-sub">{t.sub}</div>
          </button>
        {/each}
      </div>
    </div>
  {:else}
    <div class="content gestures">
      <h2>Here's the whole game</h2>
      <p class="sub">Two gestures, that's it.</p>
      <div class="gesture-row">
        <div class="g-circle"><span>→</span></div>
        <div><div class="g-title">Swipe across</div><div class="g-sub">on to the next idea</div></div>
      </div>
      <div class="gesture-row">
        <div class="g-circle accent"><span>↓</span></div>
        <div><div class="g-title">Dig in</div><div class="g-sub">deeper into this one</div></div>
      </div>
    </div>
  {/if}

  <div class="footer">
    {#if step > 1}
      <QxButton variant="secondary" fullWidth={false} on:click={back}>Back</QxButton>
    {/if}
    <QxButton variant="primary" on:click={next}>{step < TOTAL_STEPS ? 'Next' : 'Start learning'}</QxButton>
  </div>
</div>

<style>
  .onboarding-view {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 18px 22px 0;
    box-sizing: border-box;
    overflow-y: auto;
  }
  .topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
  .step-label { font-size: 13px; font-weight: 700; color: var(--qx-text-dim); }
  .dots { display: flex; gap: 6px; }
  .dot { width: 22px; height: 6px; border-radius: 3px; background: var(--qx-border-2); }
  .dot.filled { background: var(--qx-accent); }

  .content { flex: 1; }
  h2 { font-weight: 800; font-size: 24px; color: var(--qx-text); margin: 0 0 4px; letter-spacing: -0.01em; }
  .sub { font-size: 14px; color: var(--qx-text-dim); margin: 0 0 20px; }

  .fl { font-size: 12px; font-weight: 700; color: var(--qx-text-dim); margin-bottom: 8px; }
  .pill-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 22px; }
  .pill {
    font-size: 13px; font-weight: 700; color: var(--qx-text-2); background: var(--qx-surface);
    border: 1.5px solid var(--qx-border-2); border-radius: var(--qx-radius-pill); padding: 7px 14px;
    cursor: pointer; font-family: var(--qx-font);
  }
  .pill.active { color: var(--qx-accent); background: var(--qx-accent-soft); border-color: var(--qx-accent); }

  .type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .type-card {
    border: 1.5px solid var(--qx-border-2); background: var(--qx-surface); border-radius: var(--qx-radius-md);
    padding: 11px 12px; text-align: left; cursor: pointer; font-family: var(--qx-font);
  }
  .type-card.active { border-color: var(--qx-accent); background: var(--qx-accent-soft); }
  .type-name { font-size: 14px; font-weight: 800; color: var(--qx-text); }
  .type-sub { font-size: 11px; font-weight: 500; color: var(--qx-text-dim); }

  .gestures { display: flex; flex-direction: column; justify-content: center; }
  .gesture-row { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
  .g-circle {
    width: 48px; height: 48px; min-width: 48px; border-radius: 50%; border: 2px solid var(--qx-border-2);
    display: flex; align-items: center; justify-content: center; color: var(--qx-text); font-size: 22px;
  }
  .g-circle.accent { border-color: var(--qx-accent); color: var(--qx-accent); }
  .g-title { font-size: 16px; font-weight: 700; color: var(--qx-text); }
  .g-sub { font-size: 13px; color: var(--qx-text-dim); }

  .footer { display: flex; gap: 10px; align-items: center; padding: 16px 0 18px; }
</style>
