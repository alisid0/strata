<script>
  import SolveFirstPause from './SolveFirstPause.svelte';

  export let config;
  export let onDone = () => {};
  export let onExit = () => {};

  const STEPS = [
    { id: 'probe', label: 'Test' },
    { id: 'compact', label: 'Repack' },
    { id: 'split', label: 'Split' },
    { id: 'transfer', label: 'Deploy' },
    { id: 'reveal', label: 'Reveal' }
  ];

  const SCATTERED = ['A', 'A', null, null, 'B', 'B', null, null, 'C', 'C', null, null];
  const PACKED = ['A', 'A', 'B', 'B', 'C', 'C', null, null, null, null, null, null];
  const SPLIT_RACK = [null, 'A', 'A', null, null, 'B', null, null, 'C', 'C', null, 'D'];

  let phase = 'intro';
  let selectedSize = 1;
  let tested = new Set();
  let probeResult = null;
  let packed = false;
  let compactResult = null;
  let splitSelection = [];
  let splitDone = false;
  let transferAnswers = {};
  let transferWrong = 0;
  let usedHint = false;
  let showHint = false;
  let recorded = false;

  $: testedAll = [1, 2, 3].every((size) => tested.has(size));
  $: rack = packed ? PACKED : SCATTERED;
  $: transferDone = transferAnswers.camera === 'together' && transferAnswers.tiles === 'separate';
  $: reward = Math.min(15, 10 + (usedHint ? 0 : 2) + (transferWrong === 0 ? 3 : 1));

  function begin() {
    phase = 'probe';
  }

  function tryProbe() {
    tested = new Set([...tested, selectedSize]);
    probeResult = selectedSize <= 2
      ? { ok: true, text: `${selectedSize}-slot job fits inside one opening.` }
      : { ok: false, text: 'Rejected. Six slots are open, but none of the openings is three slots wide.' };
  }

  function enterCompact() {
    phase = 'compact';
    packed = false;
    compactResult = null;
    showHint = false;
  }

  function choosePacking(value) {
    packed = value === 'packed';
    compactResult = null;
  }

  function tryCompact() {
    compactResult = packed
      ? { ok: true, text: 'Accepted. No capacity was added; moving the occupied blocks created one usable opening.' }
      : { ok: false, text: 'Still rejected. The same three narrow openings remain.' };
  }

  function enterSplit() {
    phase = 'split';
    splitSelection = [];
    splitDone = false;
    showHint = false;
  }

  function toggleSplit(index) {
    if (SPLIT_RACK[index] || splitDone) return;
    splitSelection = splitSelection.includes(index)
      ? splitSelection.filter((slot) => slot !== index)
      : splitSelection.length < 4
        ? [...splitSelection, index]
        : splitSelection;
  }

  function dispatchSplit() {
    if (splitSelection.length !== 4) return;
    splitDone = true;
  }

  function enterTransfer() {
    phase = 'transfer';
    transferAnswers = {};
    transferWrong = 0;
    showHint = false;
  }

  function answerTransfer(job, answer) {
    const correct = (job === 'camera' && answer === 'together')
      || (job === 'tiles' && answer === 'separate');
    if (correct) {
      transferAnswers = { ...transferAnswers, [job]: answer };
    } else {
      transferWrong += 1;
    }
  }

  function reveal() {
    phase = 'reveal';
    if (recorded) return;
    recorded = true;
    onDone({
      id: config.id,
      reward,
      evidenceCount: 4,
      patternFound: true,
      compared: true,
      transferred: true,
      transferFirstTry: transferWrong === 0,
      usedHint
    });
  }

  function useHint() {
    usedHint = true;
    showHint = true;
  }

  const slotLabel = (value, index) =>
    value ? `Slot ${index + 1}, occupied by job ${value}` : `Slot ${index + 1}, open`;
</script>

<div class="memory-game">
  {#if phase === 'intro'}
    <button class="exit" type="button" on:click={onExit} aria-label="Return to all workshops">←</button>
    <section class="intro">
      <span class="eyebrow">{config.eyebrow}</span>
      <div class="rack-mark" aria-hidden="true">
        {#each Array(12) as _, i}<i class:lit={i === 1 || i === 4 || i === 8}></i>{/each}
      </div>
      <h2>{config.title}</h2>
      <p>A flight computer has six open rack slots. A critical three-slot navigation job is waiting—but the dispatch console refuses it.</p>
      <strong>Test the rack, recover the launch job, then choose a placement rule for two new systems.</strong>
      <button class="primary" type="button" on:click={begin}>Open dispatch console</button>
    </section>

  {:else if phase === 'reveal'}
    <section class="reveal">
      <span class="eyebrow">Concept uncovered</span>
      <h2>You discovered memory allocation.</h2>
      <p>The rack was <strong>RAM</strong>, and each job needed space assigned by the operating system.</p>

      <div class="concept-grid">
        <article>
          <b>External fragmentation</b>
          <span>Enough memory was free in total, but it was broken into gaps too small for one contiguous job.</span>
        </article>
        <article>
          <b>Compaction</b>
          <span>Moving allocated blocks together combined the scattered gaps into one usable block.</span>
        </article>
        <article>
          <b>Paging</b>
          <span>Splitting a job into fixed-size pages let its pieces occupy separate free frames.</span>
        </article>
      </div>

      <div class="mapping" aria-label="Game actions mapped to memory concepts">
        <span>Rack slots → memory locations</span>
        <span>Job blocks → allocated data</span>
        <span>Openings → free memory</span>
      </div>

      <div class="reward-panel">
        <div>
          <span>Discovery distinction</span>
          <strong>{config.rewardLabel}</strong>
        </div>
        <b>+{reward} W</b>
      </div>
      <button class="primary" type="button" on:click={onExit}>Return to workshops</button>
    </section>

  {:else}
    <button class="exit" type="button" on:click={onExit} aria-label="Return to all workshops">←</button>
    <header>
      <span class="eyebrow">{config.eyebrow}</span>
      <h2>{config.title}</h2>
    </header>

    <div class="rail" aria-label="Discovery progress">
      {#each STEPS as step}
        <span
          class:current={step.id === phase}
          class:done={STEPS.findIndex((item) => item.id === phase) > STEPS.findIndex((item) => item.id === step.id)}
        >{step.label}</span>
      {/each}
    </div>
    <p class="hidden-note">System names stay hidden until the final deployment.</p>

    {#if phase === 'probe'}
      <section class="stage">
        <div class="stage-copy">
          <span>Rack diagnostic</span>
          <h3>Six open slots. What can actually fit?</h3>
          <p>Every job must occupy one unbroken run of slots. Test all three job sizes.</p>
        </div>

        <div class="rack" aria-label="Launch rack with scattered openings">
          {#each SCATTERED as value, index}
            <div class="slot" class:free={!value} aria-label={slotLabel(value, index)}>
              {value || index + 1}
            </div>
          {/each}
        </div>

        <div class="meter">
          <span><b>6</b> open</span>
          <span><b>2</b> widest opening</span>
          <span><b>{tested.size}/3</b> tested</span>
        </div>

        <div class="size-picker" aria-label="Choose a job size">
          {#each [1, 2, 3] as size}
            <button type="button" class:active={selectedSize === size} on:click={() => { selectedSize = size; probeResult = null; }}>
              {size}-slot job {tested.has(size) ? '✓' : ''}
            </button>
          {/each}
        </div>
        <button class="primary" type="button" on:click={tryProbe}>Run placement test</button>

        {#if probeResult}
          <div class="result" class:success={probeResult.ok} class:failure={!probeResult.ok} aria-live="polite">
            <b>{probeResult.ok ? 'Accepted' : 'Rejected'}</b>
            <span>{probeResult.text}</span>
          </div>
        {/if}

        {#if testedAll}
          <SolveFirstPause
            title="Total space is not the whole story."
            message="Small jobs fit. The three-slot job fails even though six slots are open. The width and position of each opening matter."
            actionLabel="Inspect the rack"
            onContinue={enterCompact}
          />
        {/if}
      </section>

    {:else if phase === 'compact'}
      <section class="stage">
        <div class="stage-copy">
          <span>Recovery attempt</span>
          <h3>Make one opening wide enough.</h3>
          <p>You may move occupied blocks, but you cannot add or remove any slots.</p>
        </div>

        <div class="rack" aria-label="Rearrangeable launch rack">
          {#each rack as value, index}
            <div class="slot" class:free={!value} aria-label={slotLabel(value, index)}>
              {value || index + 1}
            </div>
          {/each}
        </div>

        <div class="arrangements">
          <button type="button" class:active={!packed} on:click={() => choosePacking('gaps')}>Leave the gaps</button>
          <button type="button" class:active={packed} on:click={() => choosePacking('packed')}>Pack occupied blocks together</button>
        </div>
        <button class="primary" type="button" on:click={tryCompact}>Load the 3-slot job</button>

        {#if compactResult}
          <div class="result" class:success={compactResult.ok} class:failure={!compactResult.ok} aria-live="polite">
            <b>{compactResult.ok ? 'Launch job loaded' : 'Placement rejected'}</b>
            <span>{compactResult.text}</span>
          </div>
        {/if}

        {#if compactResult?.ok}
          <SolveFirstPause
            title="Same capacity. Different shape."
            message="Packing the occupied blocks together turned three narrow openings into one wide opening. Nothing was deleted and no new slot appeared."
            actionLabel="Try another system"
            onContinue={enterSplit}
          />
        {:else if showHint}
          <p class="hint">Move A, B, and C beside one another. Their old openings will join into a wider run.</p>
        {:else}
          <button class="hint-button" type="button" on:click={useHint}>Need a nudge?</button>
        {/if}
      </section>

    {:else if phase === 'split'}
      <section class="stage">
        <div class="stage-copy">
          <span>Second dispatch console</span>
          <h3>This job arrives in four independent pieces.</h3>
          <p>The pieces do not need to touch. Select any four open slots, then dispatch them together.</p>
        </div>

        <div class="rack selectable" aria-label="Rack accepting separate job pieces">
          {#each SPLIT_RACK as value, index}
            <button
              type="button"
              class="slot"
              class:free={!value}
              class:selected={splitSelection.includes(index)}
              disabled={!!value || splitDone}
              aria-pressed={splitSelection.includes(index)}
              aria-label={value ? `Slot ${index + 1}, occupied` : `Open slot ${index + 1}`}
              on:click={() => toggleSplit(index)}
            >
              {value || (splitSelection.includes(index) ? 'J' : index + 1)}
            </button>
          {/each}
        </div>

        <div class="meter">
          <span><b>{splitSelection.length}/4</b> pieces placed</span>
          <span><b>2</b> widest opening</span>
        </div>
        <button class="primary" type="button" disabled={splitSelection.length !== 4 || splitDone} on:click={dispatchSplit}>
          Dispatch four pieces
        </button>

        {#if splitDone}
          <div class="result success" aria-live="polite">
            <b>Job accepted</b>
            <span>The four pieces occupy separate openings but still belong to one job.</span>
          </div>
          <SolveFirstPause
            title="One job does not always need one block."
            message="The first console demanded a single run. This console tracks the pieces, so scattered openings become useful."
            actionLabel="Set deployment rules"
            onContinue={enterTransfer}
          />
        {/if}
      </section>

    {:else if phase === 'transfer'}
      <section class="stage">
        <div class="stage-copy">
          <span>Final deployment</span>
          <h3>Choose the right placement rule.</h3>
          <p>These systems have different constraints. Apply both patterns you discovered.</p>
        </div>

        <article class="transfer-card" class:solved={transferAnswers.camera}>
          <div>
            <span>Live camera buffer</span>
            <p>Three linked frames must be read as one uninterrupted strip.</p>
          </div>
          <div class="transfer-options">
            <button type="button" disabled={!!transferAnswers.camera} on:click={() => answerTransfer('camera', 'separate')}>Use separate openings</button>
            <button type="button" disabled={!!transferAnswers.camera} on:click={() => answerTransfer('camera', 'together')}>Pack first, then keep it together</button>
          </div>
        </article>

        <article class="transfer-card" class:solved={transferAnswers.tiles}>
          <div>
            <span>Offline map tiles</span>
            <p>Four independent tiles may be fetched in any order.</p>
          </div>
          <div class="transfer-options">
            <button type="button" disabled={!!transferAnswers.tiles} on:click={() => answerTransfer('tiles', 'together')}>Wait for one four-slot opening</button>
            <button type="button" disabled={!!transferAnswers.tiles} on:click={() => answerTransfer('tiles', 'separate')}>Use separate openings</button>
          </div>
        </article>

        {#if transferWrong}
          <p class="hint" aria-live="polite">Match the placement rule to the job: must its pieces stay adjacent, or can the console track them separately?</p>
        {/if}

        {#if transferDone}
          <SolveFirstPause
            title="Both placement rules deployed."
            message="You preserved one uninterrupted job and used scattered capacity for independent pieces. The hidden computer system can now be named."
            actionLabel="Reveal the system"
            onContinue={reveal}
          />
        {/if}
      </section>
    {/if}
  {/if}
</div>

<style>
  .memory-game {
    position: relative;
    width: 100%;
    max-width: 660px;
    margin: 0 auto;
    color: var(--qx-text);
    font-family: var(--qx-font);
  }

  button { font: inherit; }
  button:focus-visible { outline: 3px solid var(--qx-accent); outline-offset: 3px; }
  button:disabled { cursor: not-allowed; opacity: .62; }

  .exit {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 44px;
    height: 44px;
    border: 1.5px solid var(--qx-border);
    border-radius: 50%;
    background: var(--qx-surface);
    color: var(--qx-text);
    cursor: pointer;
    font-size: 20px;
  }

  header, .intro, .reveal { text-align: center; }
  header { padding: 2px 52px 8px; }
  header h2, .intro h2, .reveal h2 {
    margin: 4px 0 0;
    font-size: clamp(22px, 5vw, 30px);
    font-weight: 950;
    line-height: 1.08;
  }

  .eyebrow {
    color: var(--qx-accent-text);
    font-size: 10px;
    font-weight: 950;
    letter-spacing: .12em;
    text-transform: uppercase;
  }

  .intro, .reveal {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    padding: 10px 4px;
  }
  .intro p, .intro > strong, .reveal > p {
    max-width: 48ch;
    margin: 0;
    color: var(--qx-text-dim);
    font-size: 14px;
    line-height: 1.55;
  }
  .intro > strong { color: var(--qx-text); }

  .rack-mark {
    display: grid;
    grid-template-columns: repeat(4, 18px);
    gap: 5px;
    padding: 14px;
    border: 2px solid var(--qx-text);
    background: var(--qx-surface-2);
    box-shadow: 5px 5px 0 var(--qx-border-2);
  }
  .rack-mark i {
    width: 18px;
    height: 18px;
    border: 1px solid var(--qx-border-2);
    background: var(--qx-surface);
  }
  .rack-mark i.lit { background: var(--qx-accent); }

  .rail {
    display: flex;
    justify-content: center;
    gap: 5px;
    margin: 3px 0 0;
    flex-wrap: wrap;
  }
  .rail span {
    padding: 5px 9px;
    border: 1px solid var(--qx-border);
    border-radius: 999px;
    background: var(--qx-surface-2);
    color: var(--qx-text-faint);
    font-size: 9px;
    font-weight: 900;
    letter-spacing: .05em;
    text-transform: uppercase;
  }
  .rail span.current {
    border-color: var(--qx-accent);
    background: var(--qx-accent-soft);
    color: var(--qx-accent-text);
  }
  .rail span.done {
    border-color: var(--qx-green);
    background: var(--qx-green-soft);
    color: var(--qx-green-text);
  }
  .hidden-note {
    margin: 7px 0 14px;
    color: var(--qx-text-faint);
    font-size: 10px;
    font-weight: 800;
    text-align: center;
    text-transform: uppercase;
  }

  .stage {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .stage-copy span, .transfer-card span {
    color: var(--qx-accent-text);
    font-size: 10px;
    font-weight: 950;
    letter-spacing: .1em;
    text-transform: uppercase;
  }
  .stage-copy h3 {
    margin: 3px 0;
    font-size: 18px;
    font-weight: 950;
  }
  .stage-copy p, .transfer-card p {
    margin: 0;
    color: var(--qx-text-dim);
    font-size: 13px;
    line-height: 1.45;
  }

  .rack {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 4px;
    padding: 9px;
    border: 2px solid var(--qx-text);
    border-radius: 4px;
    background: var(--qx-surface-2);
    box-shadow: 5px 5px 0 var(--qx-border-2);
  }
  .rack.selectable { grid-template-columns: repeat(6, minmax(44px, 1fr)); }
  .slot {
    display: grid;
    place-items: center;
    min-width: 0;
    min-height: 46px;
    border: 1.5px solid var(--qx-text);
    border-radius: 2px;
    background: var(--qx-accent);
    color: var(--qx-bg);
    font-size: 11px;
    font-weight: 950;
  }
  .slot.free {
    border-style: dashed;
    border-color: var(--qx-border-2);
    background: var(--qx-surface);
    color: var(--qx-text-faint);
  }
  button.slot { cursor: pointer; padding: 0; }
  button.slot.selected {
    border-style: solid;
    border-color: var(--qx-green);
    background: var(--qx-green);
    color: var(--qx-bg);
  }

  .meter {
    display: flex;
    gap: 7px;
    flex-wrap: wrap;
  }
  .meter span {
    flex: 1;
    min-width: 105px;
    padding: 7px 9px;
    border: 1px solid var(--qx-border);
    background: var(--qx-surface-2);
    color: var(--qx-text-dim);
    font-size: 11px;
    font-weight: 750;
    text-align: center;
  }
  .meter b { color: var(--qx-text); }

  .size-picker, .arrangements, .transfer-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 7px;
  }
  .arrangements, .transfer-options { grid-template-columns: repeat(2, 1fr); }
  .size-picker button, .arrangements button, .transfer-options button {
    min-height: 46px;
    padding: 7px 10px;
    border: 1.5px solid var(--qx-border-2);
    border-radius: 4px;
    background: var(--qx-surface);
    color: var(--qx-text);
    cursor: pointer;
    font-size: 11.5px;
    font-weight: 850;
  }
  .size-picker button.active, .arrangements button.active {
    border-color: var(--qx-accent);
    background: var(--qx-accent-soft);
    color: var(--qx-accent-text);
  }

  .primary {
    width: 100%;
    min-height: 48px;
    padding: 0 18px;
    border: 0;
    border-radius: 4px;
    background: var(--qx-accent);
    color: var(--qx-bg);
    cursor: pointer;
    font-size: 13px;
    font-weight: 950;
    letter-spacing: .02em;
  }
  .primary:not(:disabled):active { transform: translateY(1px); }

  .result, .hint {
    display: grid;
    gap: 3px;
    padding: 11px 12px;
    border: 1.5px solid var(--qx-border);
    border-radius: 4px;
    font-size: 12px;
    line-height: 1.4;
  }
  .result.success {
    border-color: var(--qx-green);
    background: var(--qx-green-soft);
    color: var(--qx-green-text);
  }
  .result.failure, .hint {
    border-color: var(--qx-danger);
    background: var(--qx-danger-soft);
    color: var(--qx-danger-text);
  }
  .hint-button {
    align-self: center;
    min-height: 44px;
    border: 0;
    background: transparent;
    color: var(--qx-accent-text);
    cursor: pointer;
    font-weight: 850;
    text-decoration: underline;
  }

  .transfer-card {
    display: grid;
    gap: 10px;
    padding: 12px;
    border: 1.5px solid var(--qx-border);
    border-radius: 4px;
    background: var(--qx-surface);
  }
  .transfer-card.solved {
    border-color: var(--qx-green);
    background: var(--qx-green-soft);
  }

  .concept-grid {
    display: grid;
    width: 100%;
    gap: 8px;
  }
  .concept-grid article {
    display: grid;
    gap: 3px;
    padding: 11px 12px;
    border: 1px solid var(--qx-border);
    border-left: 4px solid var(--qx-accent);
    background: var(--qx-surface);
    text-align: left;
  }
  .concept-grid b { font-size: 13px; }
  .concept-grid span { color: var(--qx-text-dim); font-size: 12px; line-height: 1.45; }

  .mapping {
    display: flex;
    justify-content: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .mapping span {
    padding: 5px 9px;
    border: 1px solid var(--qx-border);
    border-radius: 999px;
    background: var(--qx-surface-2);
    color: var(--qx-text-dim);
    font-size: 10px;
    font-weight: 800;
  }

  .reward-panel {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    padding: 12px 14px;
    border: 1.5px solid var(--qx-accent);
    border-radius: 4px;
    background: var(--qx-accent-soft);
    text-align: left;
  }
  .reward-panel span {
    display: block;
    color: var(--qx-accent-text);
    font-size: 9px;
    font-weight: 900;
    letter-spacing: .08em;
    text-transform: uppercase;
  }
  .reward-panel strong { font-size: 15px; }
  .reward-panel > b { color: var(--qx-accent-text); font-size: 19px; }

  @media (max-width: 560px) {
    .memory-game { max-width: 100%; }
    .rack { gap: 2px; padding: 6px; }
    .slot { min-height: 44px; font-size: 9px; }
    .rack.selectable { grid-template-columns: repeat(6, minmax(44px, 1fr)); }
    .arrangements, .transfer-options { grid-template-columns: 1fr; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; animation: none !important; }
  }
</style>
