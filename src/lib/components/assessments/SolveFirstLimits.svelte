<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import LimitPlot from './LimitPlot.svelte';

  export let config;
  export let onDone = () => {};
  export let onExit = () => {};

  const DISTANCES = [4, 2, 1, 0.5, 0.25];

  let phase = 'brief';
  let hintUsed = false;
  let activeHint = '';
  let recorded = false;
  let reducedMotion = false;

  onMount(() => {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Phase 1: one shared destination from two directions.
  let leftIndex = 0;
  let rightIndex = 0;
  let convergeRuns = [];
  let convergePick = '';
  let convergeMistakes = 0;

  $: leftDistances = new Set(convergeRuns.filter((r) => r.side === 'left').map((r) => r.distance));
  $: rightDistances = new Set(convergeRuns.filter((r) => r.side === 'right').map((r) => r.distance));
  $: leftNear = [...leftDistances].some((d) => d <= 0.5);
  $: rightNear = [...rightDistances].some((d) => d <= 0.5);
  $: convergeEvidenceReady = leftDistances.size >= 3 && rightDistances.size >= 3 && leftNear && rightNear;
  $: convergeReady = convergeEvidenceReady && convergePick === '6';

  // Phase 2: the exact point can disagree with nearby behaviour.
  let pointSamples = [];
  let pointPick = '';
  let pointMistakes = 0;
  $: pointLeft = new Set(pointSamples.filter((r) => r.side === 'left').map((r) => r.distance));
  $: pointRight = new Set(pointSamples.filter((r) => r.side === 'right').map((r) => r.distance));
  $: pointEvidenceReady = pointLeft.size >= 2 && pointRight.size >= 2;
  $: pointReady = pointEvidenceReady && pointPick === 'nearby';

  // Phase 3: the two directions can disagree.
  let splitSamples = [];
  let splitPick = '';
  let splitMistakes = 0;
  $: splitLeft = new Set(splitSamples.filter((r) => r.side === 'left').map((r) => r.distance));
  $: splitRight = new Set(splitSamples.filter((r) => r.side === 'right').map((r) => r.distance));
  $: splitEvidenceReady = splitLeft.size >= 2 && splitRight.size >= 2;
  $: splitReady = splitEvidenceReady && splitPick === 'different';

  // Phase 4: changed surface setting and both possible outcomes.
  let bridgeSamples = [];
  let bridgePick = '';
  let streamSamples = [];
  let streamPick = '';
  let stabilityPick = '';
  let transferMistakes = 0;
  $: bridgeLeft = new Set(bridgeSamples.filter((r) => r.side === 'left').map((r) => r.distance));
  $: bridgeRight = new Set(bridgeSamples.filter((r) => r.side === 'right').map((r) => r.distance));
  $: bridgeEvidenceReady = bridgeLeft.size >= 2 && bridgeRight.size >= 2;
  $: streamSides = new Set(streamSamples.map((r) => r.side));
  $: streamEvidenceReady = streamSides.has('left') && streamSides.has('right');
  $: transferReady =
    bridgeEvidenceReady &&
    bridgePick === '12' &&
    streamEvidenceReady &&
    streamPick === 'refuse' &&
    stabilityPick === 'closer';
  $: transferFirstTry = transferReady && transferMistakes === 0;

  $: convergePlot = convergeRuns.map((r, i) => ({
    x: r.side === 'left' ? -r.distance : r.distance,
    y: r.reading,
    latest: i === convergeRuns.length - 1
  }));
  $: pointPlot = pointSamples.map((r, i) => ({
    x: r.side === 'left' ? -r.distance : r.distance,
    y: r.reading,
    latest: i === pointSamples.length - 1
  }));
  $: splitPlot = splitSamples.map((r, i) => ({
    x: r.side === 'left' ? -r.distance : r.distance,
    y: r.reading,
    latest: i === splitSamples.length - 1
  }));
  $: bridgePlot = bridgeSamples.map((r, i) => ({
    x: r.side === 'left' ? -r.distance : r.distance,
    y: r.reading,
    latest: i === bridgeSamples.length - 1
  }));

  $: evidenceScore =
    leftDistances.has(0.25) && rightDistances.has(0.25) &&
    pointEvidenceReady && splitEvidenceReady ? 4 : 3;
  $: reward = Math.min(15, 6 + evidenceScore + (transferFirstTry ? 3 : 1) + (hintUsed ? 0 : 2));

  const PHASES = ['converge', 'point', 'split', 'transfer', 'reveal'];
  $: phaseIndex = phase === 'brief' ? 0 : PHASES.indexOf(phase) + 1;

  function readingForShared(side, distance) {
    return Number((side === 'left' ? 6 - distance : 6 + distance).toFixed(2));
  }

  function sampleConverge(side) {
    const distance = side === 'left' ? DISTANCES[leftIndex] : DISTANCES[rightIndex];
    const reading = readingForShared(side, distance);
    if (!convergeRuns.some((r) => r.side === side && r.distance === distance)) {
      convergeRuns = [...convergeRuns, { side, distance, reading }];
    } else {
      convergeRuns = [...convergeRuns];
    }
  }

  function moveProbe(side, delta) {
    if (side === 'left') leftIndex = Math.max(0, Math.min(DISTANCES.length - 1, leftIndex + delta));
    else rightIndex = Math.max(0, Math.min(DISTANCES.length - 1, rightIndex + delta));
  }

  function pickConverge(value) {
    if (value !== '6') convergeMistakes += 1;
    convergePick = value;
  }

  function samplePoint(side, distance) {
    if (!pointSamples.some((r) => r.side === side && r.distance === distance)) {
      pointSamples = [...pointSamples, { side, distance, reading: readingForShared(side, distance) }];
    }
  }

  function pickPoint(value) {
    if (value !== 'nearby') pointMistakes += 1;
    pointPick = value;
  }

  function sampleSplit(side, distance) {
    const reading = Number((side === 'left' ? 3 - distance : 7 + distance).toFixed(2));
    if (!splitSamples.some((r) => r.side === side && r.distance === distance)) {
      splitSamples = [...splitSamples, { side, distance, reading }];
    }
  }

  function pickSplit(value) {
    if (value !== 'different') splitMistakes += 1;
    splitPick = value;
  }

  function sampleBridge(side, distance) {
    const reading = Number((side === 'left' ? 12 - distance / 2 : 12 + distance / 2).toFixed(2));
    if (!bridgeSamples.some((r) => r.side === side && r.distance === distance)) {
      bridgeSamples = [...bridgeSamples, { side, distance, reading }];
    }
  }

  function pickBridge(value) {
    if (value !== '12') transferMistakes += 1;
    bridgePick = value;
  }

  function sampleStream(side) {
    const reading = side === 'left' ? 4.1 : 7.9;
    if (!streamSamples.some((r) => r.side === side)) {
      streamSamples = [...streamSamples, { side, reading }];
    }
  }

  function pickStream(value) {
    if (value !== 'refuse') transferMistakes += 1;
    streamPick = value;
  }
  function pickStability(value) {
    if (value !== 'closer') transferMistakes += 1;
    stabilityPick = value;
  }

  function showHint(key) {
    hintUsed = true;
    activeHint = activeHint === key ? '' : key;
  }

  function finishDiscovery() {
    if (!transferReady) return;
    phase = 'reveal';
    if (!recorded) {
      recorded = true;
      onDone({
        id: config.id,
        reward,
        evidenceCount:
          leftDistances.size + rightDistances.size +
          pointLeft.size + pointRight.size +
          splitLeft.size + splitRight.size,
        patternFound: true,
        compared: true,
        transferFirstTry,
        usedHint: hintUsed
      });
    }
  }

  function restart() {
    phase = 'brief';
    hintUsed = false;
    activeHint = '';
    recorded = false;
    leftIndex = 0;
    rightIndex = 0;
    convergeRuns = [];
    convergePick = '';
    convergeMistakes = 0;
    pointSamples = [];
    pointPick = '';
    pointMistakes = 0;
    splitSamples = [];
    splitPick = '';
    splitMistakes = 0;
    bridgeSamples = [];
    bridgePick = '';
    streamSamples = [];
    streamPick = '';
    stabilityPick = '';
    transferMistakes = 0;
  }
</script>

<div class="solve-first">
  <header class="mode-head">
    <button class="exit" on:click={onExit} aria-label="Return to all workshops">←</button>
    <div><span>{config.eyebrow}</span><strong>Solve First</strong></div>
    <div class="phase-count">{phaseIndex}/5</div>
  </header>

  <div class="phase-line" aria-label="Discovery progress">
    {#each PHASES as item, i}
      <span class:active={phase === item} class:done={phaseIndex > i + 1}></span>
    {/each}
  </div>

  {#key phase}
    <section
      class="phase"
      in:fly={{ x: reducedMotion ? 0 : 24, duration: reducedMotion ? 0 : 220 }}
      out:fade={{ duration: reducedMotion ? 0 : 80 }}
    >
      {#if phase === 'brief'}
        <div class="brief">
          <div class="sensor-mark" aria-hidden="true"><i></i><span></span><b></b></div>
          <div class="micro-label">Remote monitoring · Sensor gap</div>
          <h2>Recover the Reading</h2>
          <p>A monitoring station lost one critical reading. The failed point cannot be sampled directly. Nearby probes still work.</p>
          <div class="mission">
            <span>Your mission</span>
            <strong>Close in from both directions, reconstruct only what the evidence supports, and reject a false answer when the two sides disagree.</strong>
          </div>
          <div class="brief-rules">
            <span>Failed deductions are free</span>
            <span>Both directions are required</span>
            <span>The formal idea comes last</span>
          </div>
          <button class="primary" on:click={() => phase = 'converge'}>Open probe control</button>
        </div>

      {:else if phase === 'converge'}
        <div class="section-title">
          <span>Investigation 01 · Close in</span>
          <h2>What was the sensor heading toward?</h2>
          <p>Sample at three different distances from each direction. Include a close reading on both sides.</p>
        </div>

        <LimitPlot
          samples={convergePlot}
          caption={`Shared-target investigation. ${leftDistances.size} west samples and ${rightDistances.size} east samples collected.`}
        />

        <div class="probe-controls">
          <div class="probe">
            <span>West approach</span>
            <strong>{DISTANCES[leftIndex]} away</strong>
            <div>
              <button on:click={() => moveProbe('left', -1)} disabled={leftIndex === 0} aria-label="Move west probe farther away">−</button>
              <button on:click={() => moveProbe('left', 1)} disabled={leftIndex === DISTANCES.length - 1} aria-label="Move west probe closer">+</button>
            </div>
            <button class="sample-btn" on:click={() => sampleConverge('left')}>Sample west</button>
          </div>
          <div class="probe east">
            <span>East approach</span>
            <strong>{DISTANCES[rightIndex]} away</strong>
            <div>
              <button on:click={() => moveProbe('right', -1)} disabled={rightIndex === 0} aria-label="Move east probe farther away">−</button>
              <button on:click={() => moveProbe('right', 1)} disabled={rightIndex === DISTANCES.length - 1} aria-label="Move east probe closer">+</button>
            </div>
            <button class="sample-btn" on:click={() => sampleConverge('right')}>Sample east</button>
          </div>
        </div>

        <div class="evidence">
          <div><span>West evidence</span><strong>{leftDistances.size}/3</strong><small>{leftNear ? 'close reading secured' : 'move within 0.5'}</small></div>
          <div><span>East evidence</span><strong>{rightDistances.size}/3</strong><small>{rightNear ? 'close reading secured' : 'move within 0.5'}</small></div>
        </div>

        {#if convergeEvidenceReady}
          <div class="decision">
            <strong>Choose the single reading supported by both directions.</strong>
            <div>
              {#each ['5', '6', '7'] as value}
                <button class:selected={convergePick === value} class:correct={convergePick === value && value === '6'} class:wrong={convergePick === value && value !== '6'} on:click={() => pickConverge(value)}>{value}</button>
              {/each}
            </div>
            {#if convergePick && convergePick !== '6'}<small>That fits one side better than the other. Follow both trails closer to the gap.</small>{/if}
            {#if convergePick === '6'}<small class="ok">Both trails close in on 6.</small>{/if}
          </div>
        {/if}

        <button class="hint-link" on:click={() => showHint('converge')}>{activeHint === 'converge' ? 'Hide clue' : 'Need a clue?'}</button>
        {#if activeHint === 'converge'}<div class="hint">Ignore which side starts higher. Compare where both trails are heading as the distance shrinks.</div>{/if}
        <button class="primary" disabled={!convergeReady} on:click={() => phase = 'point'}>
          {convergeReady ? 'Reading recovered · Stress-test it' : 'Collect both trails and recover the reading'}
        </button>

      {:else if phase === 'point'}
        <div class="section-title">
          <span>Investigation 02 · Corrupted centre</span>
          <h2>The failed point wakes up</h2>
          <p>It now reports 9. Do not trust or reject it on sight. Probe two nearby distances from each direction.</p>
        </div>

        <LimitPlot
          samples={pointPlot}
          centerValue={9}
          caption="The exact failed point reports 9 while nearby probes can be sampled from both directions."
        />

        <div class="quick-probes">
          {#each [{ side: 'left', d: 1, label: 'West · 1 away' }, { side: 'left', d: 0.25, label: 'West · 0.25 away' }, { side: 'right', d: 1, label: 'East · 1 away' }, { side: 'right', d: 0.25, label: 'East · 0.25 away' }] as probe}
            <button class:done={pointSamples.some((r) => r.side === probe.side && r.distance === probe.d)} on:click={() => samplePoint(probe.side, probe.d)}>{probe.label}</button>
          {/each}
        </div>

        {#if pointEvidenceReady}
          <div class="decision">
            <strong>Which setting describes the nearby pattern?</strong>
            <div class="wide">
              <button class:selected={pointPick === 'exact'} class:wrong={pointPick === 'exact'} on:click={() => pickPoint('exact')}>Use the centre reading: 9</button>
              <button class:selected={pointPick === 'nearby'} class:correct={pointPick === 'nearby'} on:click={() => pickPoint('nearby')}>Use the nearby destination: 6</button>
            </div>
            {#if pointPick === 'exact'}<small>One isolated point does not match either nearby trail.</small>{/if}
            {#if pointPick === 'nearby'}<small class="ok">Correct. Nearby behaviour still heads to 6 even though the point reports 9.</small>{/if}
          </div>
        {/if}

        <button class="primary" disabled={!pointReady} on:click={() => phase = 'split'}>
          {pointReady ? 'Nearby pattern secured · Next case' : 'Probe both sides, then decide'}
        </button>

      {:else if phase === 'split'}
        <div class="section-title">
          <span>Investigation 03 · Split approach</span>
          <h2>Can one reading survive?</h2>
          <p>This sensor behaves differently on the two sides. Take a coarse and close sample from each direction.</p>
        </div>

        <LimitPlot
          samples={splitPlot}
          caption="Split investigation where west and east readings may head toward different destinations."
        />

        <div class="quick-probes">
          {#each [{ side: 'left', d: 1, label: 'West · 1 away' }, { side: 'left', d: 0.25, label: 'West · 0.25 away' }, { side: 'right', d: 1, label: 'East · 1 away' }, { side: 'right', d: 0.25, label: 'East · 0.25 away' }] as probe}
            <button class:done={splitSamples.some((r) => r.side === probe.side && r.distance === probe.d)} on:click={() => sampleSplit(probe.side, probe.d)}>{probe.label}</button>
          {/each}
        </div>

        {#if splitEvidenceReady}
          <div class="decision">
            <strong>What does the evidence justify?</strong>
            <div class="wide">
              <button class:selected={splitPick === 'average'} class:wrong={splitPick === 'average'} on:click={() => pickSplit('average')}>Average them into one reading</button>
              <button class:selected={splitPick === 'different'} class:correct={splitPick === 'different'} on:click={() => pickSplit('different')}>Reject one shared reading</button>
            </div>
            {#if splitPick === 'average'}<small>An average invents a destination neither trail approaches.</small>{/if}
            {#if splitPick === 'different'}<small class="ok">Correct. West heads near 3 while east heads near 7.</small>{/if}
          </div>
        {/if}

        <button class="hint-link" on:click={() => showHint('split')}>{activeHint === 'split' ? 'Hide clue' : 'Need a clue?'}</button>
        {#if activeHint === 'split'}<div class="hint">A single recovered value is defensible only when both directions close in on the same destination.</div>{/if}
        <button class="primary" disabled={!splitReady} on:click={() => phase = 'transfer'}>
          {splitReady ? 'No shared reading · Transfer' : 'Test both trails and decide'}
        </button>

      {:else if phase === 'transfer'}
        <div class="section-title">
          <span>Transfer · Structural monitoring</span>
          <h2>Recover one joint. Refuse the other.</h2>
          <p>A bridge team has two damaged joints. Use the same evidence rule in a new system.</p>
        </div>

        <div class="transfer-card">
          <div class="transfer-head"><span>Joint A</span><strong>Reconstruct the missing load reading</strong></div>
          <LimitPlot
            samples={bridgePlot}
            minY={10}
            maxY={14}
            caption="Bridge joint readings sampled from the west and east sides."
          />
          <div class="quick-probes compact">
            {#each [{ side: 'left', d: 1, label: 'West · 1 m' }, { side: 'left', d: 0.2, label: 'West · 0.2 m' }, { side: 'right', d: 1, label: 'East · 1 m' }, { side: 'right', d: 0.2, label: 'East · 0.2 m' }] as probe}
              <button class:done={bridgeSamples.some((r) => r.side === probe.side && r.distance === probe.d)} on:click={() => sampleBridge(probe.side, probe.d)}>{probe.label}</button>
            {/each}
          </div>
          {#if bridgeEvidenceReady}
            <div class="choice-row">
              <span>Recovered load</span>
              {#each ['11', '12', '13'] as value}
                <button class:correct={bridgePick === value && value === '12'} class:wrong={bridgePick === value && value !== '12'} on:click={() => pickBridge(value)}>{value}</button>
              {/each}
            </div>
          {/if}
        </div>

        {#if bridgePick === '12'}
          <div class="transfer-card">
            <div class="transfer-head"><span>Joint B</span><strong>Decide whether one repair value exists</strong></div>
            <div class="stream-stage" aria-label="Two load streams approaching the damaged joint">
              <div class="stream west" class:active={streamSides.has('left')}><span>West stream</span><strong>{streamSides.has('left') ? '4.1 → near 4' : 'not sampled'}</strong></div>
              <div class="joint">gap</div>
              <div class="stream east" class:active={streamSides.has('right')}><span>East stream</span><strong>{streamSides.has('right') ? '7.9 → near 8' : 'not sampled'}</strong></div>
            </div>
            <div class="two-actions">
              <button class:done={streamSides.has('left')} on:click={() => sampleStream('left')}>Sample west stream</button>
              <button class:done={streamSides.has('right')} on:click={() => sampleStream('right')}>Sample east stream</button>
            </div>
            {#if streamEvidenceReady}
              <div class="decision">
                <div class="wide">
                  <button class:selected={streamPick === 'average'} class:wrong={streamPick === 'average'} on:click={() => pickStream('average')}>Install their average</button>
                  <button class:selected={streamPick === 'refuse'} class:correct={streamPick === 'refuse'} on:click={() => pickStream('refuse')}>Refuse one repair value</button>
                </div>
                {#if streamPick === 'average'}<small>The streams disagree. Their average is not approached by either side.</small>{/if}
                {#if streamPick === 'refuse'}<small class="ok">Correct. Escalate the fault instead of inventing one value.</small>{/if}
              </div>
            {/if}
          </div>
        {/if}

        {#if streamPick === 'refuse'}
          <div class="transfer-card synthesis-card">
            <div class="transfer-head"><span>Engineering forecast</span><strong>Joint A’s nearest readings are 11.9 and 12.1. If both probes move closer again, what should strong evidence do?</strong></div>
            <div class="decision">
              <div class="wide">
                <button class:selected={stabilityPick === 'closer'} class:correct={stabilityPick === 'closer'} on:click={() => pickStability('closer')}>Narrow closer around 12</button>
                <button class:selected={stabilityPick === 'same'} class:wrong={stabilityPick === 'same'} on:click={() => pickStability('same')}>Keep the same gap</button>
                <button class:selected={stabilityPick === 'apart'} class:wrong={stabilityPick === 'apart'} on:click={() => pickStability('apart')}>Move farther apart</button>
              </div>
            </div>
          </div>
        {/if}

        <button class="primary" disabled={!transferReady} on:click={finishDiscovery}>
          {transferReady ? 'Reveal the mathematics' : 'Resolve both joints and forecast the next evidence'}
        </button>

      {:else if phase === 'reveal'}
        <div class="reveal">
          <div class="reveal-kicker">The reasoning has a name</div>
          <h2>You investigated limits.</h2>
          <p>A limit describes where nearby outputs head as an input closes in on a point.</p>

          <LimitPlot
            samples={convergePlot}
            targetValue={6}
            formal={true}
            caption="Formal limit diagram: as x approaches a from both sides, f of x approaches 6."
          />

          <div class="formula">
            <span>Your first recovered reading</span>
            <strong>lim<sub>x→a</sub> f(x) = 6</strong>
            <small>As x approaches a from both sides, f(x) approaches 6.</small>
          </div>

          <ul class="reveal-list">
            <li><strong>Approach:</strong> you moved probes closer without needing to sample the failed point itself.</li>
            <li><strong>Two-sided limit:</strong> one limit exists only when the left-hand and right-hand approaches agree.</li>
            <li><strong>Point value:</strong> f(a) may be missing or different; the nearby limit can still exist.</li>
            <li><strong>No limit:</strong> when one side heads to 3 and the other to 7, there is no single two-sided limit.</li>
          </ul>

          <div class="insight-ladder">
            <strong>What you actually proved</strong>
            <span><b>Evidence:</b> a credible destination became more stable as probes moved closer from both sides.</span>
            <span><b>Rule:</b> agreement near the point matters; the reading at the point can be missing or different.</span>
            <span><b>Deeper build:</b> the shrinking gap around 12 is the intuition behind tolerance: make the input close enough and the output can be forced as close to 12 as required. That leads to continuity and the formal ε–δ definition.</span>
          </div>

          <div class="reward-panel">
            <div class="reward-top">
              <div><span>Discovery distinction</span><strong>{config.rewardLabel}</strong></div>
              <b>+{reward} W</b>
            </div>
            <div class="reward-skills">
              <span class:earned={convergeEvidenceReady && pointEvidenceReady && splitEvidenceReady}>Evidence</span>
              <span class:earned={true}>Pattern</span>
              <span class:earned={transferReady}>Transfer</span>
              <span class:earned={!hintUsed}>Independent</span>
            </div>
            <small>Ws are awarded once. This distinction records a defensible inference, not speed.</small>
          </div>

          <div class="reveal-actions">
            <button class="primary" on:click={onExit}>Return to workshops</button>
            <button class="secondary" on:click={restart}>Play again</button>
          </div>
        </div>
      {/if}
    </section>
  {/key}
</div>

<style>
  .solve-first { width: 100%; max-width: 430px; margin: 0 auto; color: var(--qx-text); }
  .mode-head { display: grid; grid-template-columns: 38px 1fr auto; gap: 10px; align-items: center; margin-bottom: 11px; }
  .exit { width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid var(--qx-border); background: var(--qx-surface-2); color: var(--qx-text); font-size: 17px; cursor: pointer; }
  .mode-head div:nth-child(2) { display: flex; flex-direction: column; }
  .mode-head span { color: var(--qx-accent); font-size: 9px; font-weight: 900; letter-spacing: .11em; text-transform: uppercase; }
  .mode-head strong { font-size: 17px; font-weight: 900; }
  .phase-count { color: var(--qx-text-faint); font-size: 11px; font-weight: 900; font-variant-numeric: tabular-nums; }
  .phase-line { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; margin-bottom: 18px; }
  .phase-line span { height: 4px; border-radius: 4px; background: var(--qx-surface-3); }
  .phase-line span.active { background: var(--qx-accent); }
  .phase-line span.done { background: var(--qx-green); }
  .phase { min-height: 450px; display: flex; flex-direction: column; gap: 11px; }

  .brief, .reveal { text-align: center; display: flex; flex-direction: column; align-items: center; }
  .sensor-mark { width: 100px; height: 90px; margin: 7px 0 14px; position: relative; display: flex; align-items: center; justify-content: space-between; }
  .sensor-mark::before { content: ''; position: absolute; left: 4px; right: 4px; top: 50%; border-top: 2px solid var(--qx-text-faint); }
  .sensor-mark i, .sensor-mark b { width: 18px; height: 18px; border-radius: 50%; background: var(--qx-accent); box-shadow: 0 0 0 8px var(--qx-accent-soft); z-index: 1; }
  .sensor-mark b { background: var(--qx-pink); box-shadow: 0 0 0 8px var(--qx-pink-soft); }
  .sensor-mark span { width: 24px; height: 24px; border: 3px dashed var(--qx-danger); border-radius: 50%; background: var(--qx-surface); z-index: 1; }
  .micro-label, .section-title > span, .reveal-kicker { color: var(--qx-accent); font-size: 10px; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
  h2 { font-size: 24px; line-height: 1.15; margin: 7px 0 8px; font-weight: 950; }
  p { color: var(--qx-text-dim); font-size: 13.5px; line-height: 1.5; margin: 0; }
  .brief > p { max-width: 34ch; }
  .mission { margin: 19px 0 11px; text-align: left; width: 100%; box-sizing: border-box; border: 1.5px solid var(--qx-accent); border-radius: 14px; padding: 13px 14px; background: var(--qx-accent-soft); }
  .mission span { display: block; color: var(--qx-accent-text); font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; }
  .mission strong { display: block; color: var(--qx-text); margin-top: 4px; font-size: 14px; line-height: 1.4; }
  .brief-rules { display: flex; gap: 5px; flex-wrap: wrap; justify-content: center; margin-bottom: 18px; }
  .brief-rules span { border: 1px solid var(--qx-border); border-radius: 999px; padding: 5px 9px; font-size: 10px; font-weight: 800; color: var(--qx-text-dim); background: var(--qx-surface-2); }
  .section-title { text-align: left; }
  .section-title h2 { font-size: 21px; margin-bottom: 6px; }

  .primary, .secondary { min-height: 46px; width: 100%; border-radius: 999px; font-family: var(--qx-font); font-size: 14px; font-weight: 900; cursor: pointer; }
  .primary { border: none; background: var(--qx-accent); color: var(--qx-bg); }
  .primary:disabled { opacity: .42; cursor: not-allowed; }
  .secondary { border: 1.5px solid var(--qx-border-2); background: var(--qx-surface); color: var(--qx-text-dim); }

  .probe-controls { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
  .probe { border: 1px solid var(--qx-border); border-radius: 12px; padding: 10px; background: var(--qx-surface); display: grid; justify-items: center; gap: 7px; }
  .probe > span { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .05em; color: var(--qx-accent-text); }
  .probe.east > span { color: var(--qx-pink-text); }
  .probe > strong { font-size: 16px; font-weight: 950; }
  .probe > div { display: flex; gap: 8px; }
  .probe > div button { width: 44px; height: 44px; border: 1px solid var(--qx-border-2); border-radius: 50%; background: var(--qx-surface-2); color: var(--qx-text); font: 900 19px/1 var(--qx-font); cursor: pointer; }
  .probe > div button:disabled { opacity: .35; cursor: not-allowed; }
  .sample-btn { min-height: 44px; width: 100%; border: 1px solid var(--qx-border-2); border-radius: 10px; background: var(--qx-text); color: var(--qx-bg); font: 850 11px/1.2 var(--qx-font); cursor: pointer; }

  .evidence { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .evidence > div { border: 1px solid var(--qx-border); border-radius: 10px; background: var(--qx-surface-2); padding: 9px; display: grid; gap: 2px; }
  .evidence span { color: var(--qx-text-faint); font-size: 9px; font-weight: 900; text-transform: uppercase; }
  .evidence strong { font-size: 17px; }
  .evidence small { color: var(--qx-text-dim); font-size: 9px; }

  .decision { border: 1.5px solid var(--qx-border); border-radius: 12px; padding: 11px; background: var(--qx-surface-2); display: grid; gap: 9px; }
  .decision > strong { font-size: 12px; line-height: 1.4; }
  .decision > div { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
  .decision > div.wide { grid-template-columns: 1fr 1fr; }
  .decision button, .choice-row button { min-height: 44px; border: 1.5px solid var(--qx-border-2); border-radius: 10px; background: var(--qx-surface); color: var(--qx-text); font: 900 11px/1.25 var(--qx-font); padding: 7px; cursor: pointer; }
  .decision button.selected { border-color: var(--qx-accent); }
  .decision button.correct, .choice-row button.correct { border-color: var(--qx-green); background: var(--qx-green-soft); color: var(--qx-green-text); }
  .decision button.wrong, .choice-row button.wrong { border-color: var(--qx-danger); background: var(--qx-danger-soft); color: var(--qx-danger-text); }
  .decision small { color: var(--qx-danger-text); font-size: 10.5px; line-height: 1.4; }
  .decision small.ok { color: var(--qx-green-text); }

  .quick-probes { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
  .quick-probes button, .two-actions button { min-height: 44px; border: 1px solid var(--qx-border-2); border-radius: 10px; background: var(--qx-surface); color: var(--qx-text-dim); font: 850 10.5px/1.2 var(--qx-font); cursor: pointer; }
  .quick-probes button.done, .two-actions button.done { border-color: var(--qx-green); background: var(--qx-green-soft); color: var(--qx-green-text); }
  .quick-probes.compact { margin-top: 9px; }

  .hint-link { border: none; background: none; color: var(--qx-text-faint); font-family: var(--qx-font); font-size: 11px; font-weight: 800; cursor: pointer; margin: 0 auto; min-height: 32px; }
  .hint { border-radius: 10px; padding: 9px 11px; color: var(--qx-accent-text); background: var(--qx-accent-soft); font-size: 11px; line-height: 1.4; }

  .transfer-card { border: 1.5px solid var(--qx-border); border-radius: 14px; padding: 11px; background: var(--qx-surface-2); display: grid; gap: 8px; }
  .synthesis-card { border-color: var(--qx-accent); }
  .transfer-head { display: flex; flex-direction: column; gap: 2px; }
  .transfer-head span { color: var(--qx-accent); font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: .07em; }
  .transfer-head strong { font-size: 13px; }
  .choice-row { display: grid; grid-template-columns: 1fr repeat(3, 48px); align-items: center; gap: 6px; }
  .choice-row span { font-size: 10px; font-weight: 850; color: var(--qx-text-dim); }

  .stream-stage { display: grid; grid-template-columns: 1fr 42px 1fr; align-items: center; gap: 5px; }
  .stream { border: 1px solid var(--qx-border); border-radius: 10px; padding: 10px 6px; background: var(--qx-surface); display: grid; gap: 3px; text-align: center; opacity: .55; }
  .stream.active { opacity: 1; border-color: var(--qx-accent); }
  .stream.east.active { border-color: var(--qx-pink); }
  .stream span { color: var(--qx-text-faint); font-size: 9px; font-weight: 900; text-transform: uppercase; }
  .stream strong { font-size: 10px; color: var(--qx-text); }
  .joint { border: 2px dashed var(--qx-danger); border-radius: 9px; padding: 10px 3px; text-align: center; color: var(--qx-danger-text); font-size: 9px; font-weight: 900; }
  .two-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }

  .reveal h2 { font-size: 22px; }
  .formula { width: 100%; box-sizing: border-box; border: 1.5px solid var(--qx-accent); border-radius: 13px; padding: 12px; background: var(--qx-accent-soft); display: grid; gap: 4px; text-align: left; }
  .formula span { color: var(--qx-accent-text); font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: .06em; }
  .formula strong { color: var(--qx-text); font-size: 22px; font-weight: 950; }
  .formula small { color: var(--qx-text-dim); font-size: 10.5px; }
  .reveal-list { list-style: none; text-align: left; width: 100%; margin: 0; padding: 0; display: grid; gap: 6px; }
  .reveal-list li { border: 1px solid var(--qx-border); border-radius: 9px; padding: 9px 11px; background: var(--qx-surface-2); font-size: 11.5px; line-height: 1.4; color: var(--qx-text-dim); }
  .reveal-list strong { color: var(--qx-text); }
  .insight-ladder { width: 100%; box-sizing: border-box; display: grid; gap: 7px; border: 1.5px solid var(--qx-accent); border-radius: 12px; padding: 11px 12px; background: var(--qx-accent-soft); text-align: left; }
  .insight-ladder > strong { color: var(--qx-accent-text); font-size: 12px; }
  .insight-ladder span { color: var(--qx-text-dim); font-size: 10.5px; line-height: 1.4; }
  .insight-ladder b { color: var(--qx-text); }

  .reward-panel { width: 100%; box-sizing: border-box; border: 1.5px solid var(--qx-green); border-radius: 14px; background: var(--qx-green-soft); padding: 12px; text-align: left; }
  .reward-top { display: flex; justify-content: space-between; align-items: center; }
  .reward-top div { display: flex; flex-direction: column; }
  .reward-top span { font-size: 9px; color: var(--qx-green-text); font-weight: 900; text-transform: uppercase; letter-spacing: .08em; }
  .reward-top strong { font-size: 15px; color: var(--qx-text); }
  .reward-top b { color: var(--qx-green-text); font-size: 21px; }
  .reward-skills { display: flex; gap: 5px; flex-wrap: wrap; margin: 10px 0 7px; }
  .reward-skills span { border: 1px solid var(--qx-border); background: var(--qx-surface); color: var(--qx-text-faint); border-radius: 999px; padding: 4px 8px; font-size: 9px; font-weight: 850; }
  .reward-skills span.earned { color: var(--qx-green-text); border-color: var(--qx-green); }
  .reward-panel small { color: var(--qx-text-dim); font-size: 9.5px; line-height: 1.35; display: block; }
  .reveal-actions { width: 100%; display: grid; gap: 7px; }

  @media (max-width: 360px) {
    .solve-first { max-width: 100%; }
    .phase { min-height: 420px; }
    h2 { font-size: 21px; }
    .probe-controls { grid-template-columns: 1fr; }
  }

  @media (prefers-reduced-motion: reduce) {
    .phase { scroll-behavior: auto; }
  }
</style>
