<script>
  import Workshop from '../lib/components/assessments/Workshop.svelte';
  import { getBitDataWorkshop, getPhysicsCoreWorkshop, getChemistryCoreWorkshop, getMathsMatricesWorkshop } from '../lib/content/workshops.js';

  export let onNavigate;

  let runId = 0;
  let finished = false;
  let score = 0;
  let total = 0;
  let activeTrack = 'bit';

  const TRACKS = {
    bit: {
      label: 'The Bit',
      title: 'Binary/Data micro-drill',
      sub: 'Bits, bytes, pixels, text, and sound.',
      icon: '/icons/gateways/bit.png',
      pathId: 'BIT_001',
      getWorkshop: getBitDataWorkshop
    },
    physics: {
      label: 'Physics',
      title: 'Forces, waves, and energy',
      sub: 'Balance pushes, tune waves, and read motion.',
      icon: '/icons/gateways/unit.png',
      pathId: 'PHYS_001',
      getWorkshop: getPhysicsCoreWorkshop
    },
    chemistry: {
      label: 'Chemistry',
      title: 'Atom and molecule builder',
      sub: 'Build atoms, ions, isotopes, water, and carbon dioxide.',
      icon: '/icons/gateways/atom.png',
      pathId: 'ATOM_001',
      getWorkshop: getChemistryCoreWorkshop
    },
    matrices: {
      label: 'Matrices',
      title: 'Spreadsheet to space machine',
      sub: 'Read cells, store data, and transform points.',
      icon: '/icons/gateways/line.png',
      pathId: 'MATH_COORD',
      getWorkshop: getMathsMatricesWorkshop
    }
  };

  $: track = TRACKS[activeTrack];
  $: interactions = track.getWorkshop();
  $: scorePct = total ? Math.round((score / total) * 100) : 0;

  function finishWorkshop(finalScore, finalTotal) {
    score = finalScore;
    total = finalTotal;
    finished = true;
  }

  function replay() {
    runId += 1;
    score = 0;
    total = 0;
    finished = false;
  }

  function chooseTrack(id) {
    if (activeTrack === id) return;
    activeTrack = id;
    replay();
  }
</script>

<div class="qx-shell workshop-lab">
  <div class="lab-header">
    <div>
      <div class="kicker">Exercises</div>
      <h1>Workshop</h1>
      <p>Fast hands-on drills for turning ideas into working understanding.</p>
    </div>
    <img src={track.icon} alt={track.label} />
  </div>

  <div class="track-tabs" role="tablist" aria-label="Workshop tracks">
    {#each Object.entries(TRACKS) as [id, item]}
      <button
        class:active={activeTrack === id}
        on:click={() => chooseTrack(id)}
        role="tab"
        aria-selected={activeTrack === id}
      >
        <img src={item.icon} alt="" />
        <span>{item.label}</span>
      </button>
    {/each}
  </div>

  <section class="spotlight">
    <div class="spotlight-copy">
      <span>{track.label}</span>
      <strong>{track.title}</strong>
      <small>{track.sub}</small>
    </div>
    <button on:click={() => onNavigate?.('topicDetail', track.pathId)}>Open path</button>
  </section>

  <div class="workshop-card">
    {#if finished}
      <div class="done-state">
        <div class="score-ring">{scorePct}%</div>
        <h2>{score}/{total} locked in</h2>
        <p>{scorePct >= 80 ? 'Strong grasp. This is the confidence zone: the idea is usable, not just familiar.' : 'Replay once and aim for a cleaner run. Short repetition is where the pattern starts to feel automatic.'}</p>
        <button class="primary-btn" on:click={replay}>Replay drill</button>
      </div>
    {:else}
      {#key runId}
        <Workshop interactions={interactions} onDone={finishWorkshop} />
      {/key}
    {/if}
  </div>
</div>

<style>
  .workshop-lab {
    height: 100%;
    overflow-y: auto;
    padding: 16px 18px 24px;
    box-sizing: border-box;
  }

  .lab-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
  }

  .kicker {
    font-size: 11px;
    font-weight: 850;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--qx-accent);
    margin-bottom: 3px;
  }

  h1 {
    font-size: 24px;
    font-weight: 900;
    color: var(--qx-text);
    margin: 0;
  }

  p {
    font-size: 13px;
    line-height: 1.45;
    color: var(--qx-text-dim);
    margin: 4px 0 0;
  }

  .lab-header img {
    width: 50px;
    height: 50px;
    object-fit: contain;
    flex-shrink: 0;
  }

  .track-tabs {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 12px;
  }

  .track-tabs button {
    min-height: 48px;
    border-radius: 8px;
    border: 1.5px solid var(--qx-border);
    background: var(--qx-surface);
    color: var(--qx-text-dim);
    font-family: var(--qx-font);
    font-size: 13px;
    font-weight: 850;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .track-tabs span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 520px) {
    .track-tabs {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .track-tabs button.active {
    border-color: var(--qx-accent);
    background: var(--qx-accent-soft);
    color: var(--qx-accent-text);
  }

  .track-tabs img {
    width: 22px;
    height: 22px;
    object-fit: contain;
  }

  .spotlight {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border: 1.5px solid var(--qx-border);
    background: var(--qx-surface);
    border-radius: 8px;
    padding: 13px 14px;
    margin-bottom: 14px;
  }

  .spotlight-copy {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .spotlight-copy span {
    font-size: 10px;
    font-weight: 850;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--qx-text-faint);
  }

  .spotlight-copy strong {
    font-size: 15px;
    line-height: 1.2;
    color: var(--qx-text);
  }

  .spotlight-copy small {
    font-size: 12px;
    line-height: 1.3;
    color: var(--qx-text-dim);
  }

  .spotlight button,
  .primary-btn {
    border: none;
    border-radius: 999px;
    background: var(--qx-accent);
    color: #fff;
    font-family: var(--qx-font);
    font-size: 13px;
    font-weight: 850;
    cursor: pointer;
    min-height: 38px;
    padding: 0 15px;
    flex-shrink: 0;
  }

  .workshop-card {
    border: 1.5px solid var(--qx-border);
    background: var(--qx-surface);
    border-radius: 8px;
    padding: 16px 14px 18px;
    min-height: 460px;
    box-sizing: border-box;
  }

  .done-state {
    min-height: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 12px;
  }

  .score-ring {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--qx-accent-soft);
    color: var(--qx-accent-text);
    border: 1.5px solid var(--qx-accent);
    font-size: 23px;
    font-weight: 900;
    font-variant-numeric: tabular-nums;
  }

  h2 {
    font-size: 20px;
    font-weight: 900;
    color: var(--qx-text);
    margin: 0;
  }

  .done-state p {
    max-width: 32ch;
    margin: 0;
  }

  @media (max-width: 380px) {
    .track-tabs {
      grid-template-columns: 1fr;
    }

    .spotlight {
      align-items: flex-start;
      flex-direction: column;
    }

    .spotlight button {
      width: 100%;
    }
  }
</style>
