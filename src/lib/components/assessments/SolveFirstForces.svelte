<script>
  // Stop the Cart — a Solve First force lab.
  //
  // The learner commands two opposing thrusters on a runaway cart. They must:
  //   1. steady   collect three contrasting outcomes (still / left / right)
  //   2. deliver  aim the resultant to hit a right bay AND a left bay
  //   3. transfer apply balanced vs unbalanced reasoning to two new scenes
  //   4. reveal   only now meet "balanced forces" and "resultant force"
  // No written explanation, no lucky-success skip, no timer. Same reward
  // contract as the Crack the Lockers reference so the modes stay consistent.
  import { fly, fade } from 'svelte/transition';
  import ForceEvidence from './ForceEvidence.svelte';

  export let config;
  export let onDone = () => {};
  export let onExit = () => {};

  const MAX = 5;

  let phase = 'brief';
  let left = 1;
  let right = 1;
  let lastRun = null;              // { left, right, outcome } of the most recent test
  let runs = [];                   // steady-phase log
  let seen = { still: false, left: false, right: false };
  let deliveredRight = false;
  let deliveredLeft = false;
  let deliverRun = null;
  let hintUsed = false;
  let activeHint = '';
  let transfer = { tug: '', ramp: '' };
  let transferMistakes = 0;
  let recorded = false;

  // The left-side thruster pushes right; the right-side thruster pushes left.
  $: net = left - right;
  $: outcome = net === 0 ? 'still' : net > 0 ? 'right' : 'left';
  $: shift = Math.max(-30, Math.min(30, net * 10));
  $: steadyReady = seen.still && seen.left && seen.right;
  $: deliverReady = deliveredRight && deliveredLeft;
  $: transferReady = transfer.tug === 'equal' && transfer.ramp === 'stronger';
  $: transferFirstTry = transferReady && transferMistakes === 0;
  $: evidenceScore = runs.length >= 4 && steadyReady ? 4 : 3;
  $: reward = Math.min(15, 6 + evidenceScore + (transferFirstTry ? 3 : 1) + (hintUsed ? 0 : 2));

  function bump(side, delta) {
    if (side === 'left') left = Math.max(0, Math.min(MAX, left + delta));
    else right = Math.max(0, Math.min(MAX, right + delta));
  }

  function runSteady() {
    const result = { left, right, outcome };
    lastRun = result;
    runs = [...runs, result];
    seen = { ...seen, [outcome]: true };
  }

  function runDeliver() {
    deliverRun = { left, right, outcome };
    if (outcome === 'right') deliveredRight = true;
    if (outcome === 'left') deliveredLeft = true;
  }

  function showHint(key) {
    hintUsed = true;
    activeHint = activeHint === key ? '' : key;
  }

  function answerTransfer(scene, value) {
    const correct = scene === 'tug' ? 'equal' : 'stronger';
    if (value !== correct) transferMistakes += 1;
    transfer = { ...transfer, [scene]: value };
  }

  function finishDiscovery() {
    if (!transferReady) return;
    phase = 'reveal';
    if (!recorded) {
      recorded = true;
      onDone({
        id: config.id,
        reward,
        evidenceCount: runs.length,
        patternFound: true,
        compared: true,
        transferFirstTry,
        usedHint: hintUsed
      });
    }
  }

  function restart() {
    phase = 'brief';
    left = 1;
    right = 1;
    lastRun = null;
    runs = [];
    seen = { still: false, left: false, right: false };
    deliveredRight = false;
    deliveredLeft = false;
    deliverRun = null;
    hintUsed = false;
    activeHint = '';
    transfer = { tug: '', ramp: '' };
    transferMistakes = 0;
    recorded = false;
  }
</script>

<div class="solve-first">
  <header class="mode-head">
    <button class="exit" on:click={onExit} aria-label="Return to workshop practice">←</button>
    <div>
      <span>{config.eyebrow}</span>
      <strong>Solve First</strong>
    </div>
    <div class="phase-count">
      {phase === 'brief' ? '0' : phase === 'steady' ? '1' : phase === 'deliver' ? '2' : phase === 'transfer' ? '3' : '4'}/4
    </div>
  </header>

  <div class="phase-line" aria-label="Discovery progress">
    {#each ['steady', 'deliver', 'transfer', 'reveal'] as item}
      <span
        class:active={phase === item}
        class:done={
          (item === 'steady' && ['deliver','transfer','reveal'].includes(phase)) ||
          (item === 'deliver' && ['transfer','reveal'].includes(phase)) ||
          (item === 'transfer' && phase === 'reveal')
        }
      ></span>
    {/each}
  </div>

  {#key phase}
    <section class="phase" in:fly={{ x: 28, duration: 240 }} out:fade={{ duration: 90 }}>
      {#if phase === 'brief'}
        <div class="brief">
          <div class="cart-mark" aria-hidden="true">
            <i class="thrust"></i><span class="box"></span><i class="thrust"></i>
          </div>
          <div class="micro-label">Loading dock · Runaway cart</div>
          <h2>Stop the Cart</h2>
          <p>A loaded service cart is drifting across the dock. Two thrusters are all you have. Nobody left instructions.</p>
          <div class="mission">
            <span>Your mission</span>
            <strong>Work out what makes the cart move or hold still, then steer it into the bays on demand.</strong>
          </div>
          <div class="brief-rules">
            <span>Failed runs are free</span>
            <span>Evidence unlocks progress</span>
            <span>The rule is named at the end</span>
          </div>
          <button class="primary" on:click={() => phase = 'steady'}>Enter the dock</button>
        </div>

      {:else if phase === 'steady'}
        <div class="section-title">
          <span>Task 01 · Read the cart</span>
          <h2>Make it hold still</h2>
          <p>Set the two thrusters and run the cart. Find out exactly what decides which way it goes — or whether it goes at all.</p>
        </div>

        <div class="stage" class:still={lastRun && lastRun.outcome === 'still'}>
          <div class="thruster left" style={`--power:${left};`} aria-hidden="true"></div>
          <div class="track">
            <span class="bay left-bay">W</span>
            <span class="bay right-bay">E</span>
            <div class="cart" style={`transform: translateX(${lastRun ? shift : 0}px);`}>
              <b></b>
            </div>
          </div>
          <div class="thruster right" style={`--power:${right};`} aria-hidden="true"></div>
        </div>

        <div class="readout">
          <span>Last run</span>
          <strong>{lastRun ? (lastRun.outcome === 'still' ? 'held still' : lastRun.outcome === 'left' ? 'moved left' : 'moved right') : 'not run yet'}</strong>
        </div>

        <div class="controls">
          <div class="control">
            <span>Push from left</span>
            <strong>{left}</strong>
            <div>
              <button on:click={() => bump('left', -1)} disabled={left === 0} aria-label="Reduce left thruster">−</button>
              <button on:click={() => bump('left', 1)} disabled={left === MAX} aria-label="Increase left thruster">+</button>
            </div>
          </div>
          <div class="control">
            <span>Push from right</span>
            <strong>{right}</strong>
            <div>
              <button on:click={() => bump('right', -1)} disabled={right === 0} aria-label="Reduce right thruster">−</button>
              <button on:click={() => bump('right', 1)} disabled={right === MAX} aria-label="Increase right thruster">+</button>
            </div>
          </div>
        </div>

        <button class="test-button" on:click={runSteady}>Run the cart</button>

        <ForceEvidence {runs} {seen} />

        {#if runs.length > 0 && !steadyReady}
          <div class="nudge">Good data. You still need {['still','left','right'].filter((k) => !seen[k]).length} more contrasting {['still','left','right'].filter((k) => !seen[k]).length === 1 ? 'outcome' : 'outcomes'} — get it to hold still, drift left, and drift right.</div>
        {/if}
        <button class="hint-link" on:click={() => showHint('steady')}>{activeHint === 'steady' ? 'Hide clue' : 'Need a clue?'}</button>
        {#if activeHint === 'steady'}<div class="hint">Try equal pushes, then make one side clearly bigger. Watch what the difference does.</div>{/if}
        <button class="primary" disabled={!steadyReady} on:click={() => phase = 'deliver'}>
          {steadyReady ? 'Rule proven · Steer it' : 'Collect still, left and right'}
        </button>

      {:else if phase === 'deliver'}
        <div class="section-title">
          <span>Task 02 · Steer on demand</span>
          <h2>Deliver to both bays</h2>
          <p>Now aim it. Land the cart in the east bay and, on another run, the west bay. Prove you control the direction, not just luck.</p>
        </div>

        <div class="stage" class:still={deliverRun && deliverRun.outcome === 'still'}>
          <div class="thruster left" style={`--power:${left};`} aria-hidden="true"></div>
          <div class="track">
            <span class="bay left-bay" class:hit={deliveredLeft}>W ✓</span>
            <span class="bay right-bay" class:hit={deliveredRight}>E ✓</span>
            <div class="cart" style={`transform: translateX(${deliverRun ? shift : 0}px);`}>
              <b></b>
            </div>
          </div>
          <div class="thruster right" style={`--power:${right};`} aria-hidden="true"></div>
        </div>

        <div class="deliver-goals">
          <div class:done={deliveredRight}><b>{deliveredRight ? '✓' : '○'}</b> East bay (right)</div>
          <div class:done={deliveredLeft}><b>{deliveredLeft ? '✓' : '○'}</b> West bay (left)</div>
        </div>

        <div class="controls">
          <div class="control">
            <span>Push from left</span>
            <strong>{left}</strong>
            <div>
              <button on:click={() => bump('left', -1)} disabled={left === 0} aria-label="Reduce left thruster">−</button>
              <button on:click={() => bump('left', 1)} disabled={left === MAX} aria-label="Increase left thruster">+</button>
            </div>
          </div>
          <div class="control">
            <span>Push from right</span>
            <strong>{right}</strong>
            <div>
              <button on:click={() => bump('right', -1)} disabled={right === 0} aria-label="Reduce right thruster">−</button>
              <button on:click={() => bump('right', 1)} disabled={right === MAX} aria-label="Increase right thruster">+</button>
            </div>
          </div>
        </div>

        <button class="test-button" on:click={runDeliver}>Launch delivery</button>

        {#if deliverRun && !deliverReady}
          <div class="nudge">{deliverRun.outcome === 'still' ? 'It held still — a balanced cart goes nowhere. Make one side stronger to send it.' : `Landed in the ${deliverRun.outcome === 'right' ? 'east' : 'west'} bay. Now aim for the other one by making the other thruster win.`}</div>
        {/if}
        <button class="hint-link" on:click={() => showHint('deliver')}>{activeHint === 'deliver' ? 'Hide clue' : 'Need a clue?'}</button>
        {#if activeHint === 'deliver'}<div class="hint">A stronger push from the left sends the cart right. A stronger push from the right sends it left.</div>{/if}
        <button class="primary" disabled={!deliverReady} on:click={() => phase = 'transfer'}>
          {deliverReady ? 'Control proven · Apply it' : 'Deliver to both bays'}
        </button>

      {:else if phase === 'transfer'}
        <div class="section-title">
          <span>Field test</span>
          <h2>Call the outcome</h2>
          <p>Use what the cart taught you. The formal names are still hidden.</p>
        </div>

        <div class="policy-card">
          <div class="policy-icon" aria-hidden="true">⚑</div>
          <div class="policy-copy">
            <small>Tug of war</small>
            <strong>The flag must stay dead centre over the line. What has to be true of the two teams’ pulls?</strong>
          </div>
          <div class="policy-options">
            <button
              class:selected={transfer.tug === 'equal'}
              class:correct={transfer.tug === 'equal'}
              on:click={() => answerTransfer('tug', 'equal')}
            >Equal pulls, opposite ways</button>
            <button
              class:selected={transfer.tug === 'one'}
              class:wrong={transfer.tug === 'one'}
              on:click={() => answerTransfer('tug', 'one')}
            >One team pulling harder</button>
          </div>
        </div>

        <div class="policy-card">
          <div class="policy-icon" aria-hidden="true">▲</div>
          <div class="policy-copy">
            <small>Loading ramp</small>
            <strong>To start a heavy pallet sliding up toward the ramp, the push toward the ramp must be…</strong>
          </div>
          <div class="policy-options">
            <button
              class:selected={transfer.ramp === 'equal'}
              class:wrong={transfer.ramp === 'equal'}
              on:click={() => answerTransfer('ramp', 'equal')}
            >Equal to the push holding it back</button>
            <button
              class:selected={transfer.ramp === 'stronger'}
              class:correct={transfer.ramp === 'stronger'}
              on:click={() => answerTransfer('ramp', 'stronger')}
            >Stronger than the push holding it back</button>
          </div>
        </div>

        <button class="primary" disabled={!transferReady} on:click={finishDiscovery}>
          {transferReady ? 'Reveal the physics' : 'Call both outcomes'}
        </button>

      {:else if phase === 'reveal'}
        <div class="reveal">
          <div class="reveal-kicker">Two principles uncovered</div>
          <h2>You discovered balanced and resultant force.</h2>
          <p>You steered the cart before meeting the syllabus names for what you did.</p>

          <div class="law-reveals">
            <article>
              <div class="law-mark">= 0</div>
              <strong>Balanced forces</strong>
              <span>Equal, opposite pushes cancel. The resultant is zero, so the cart held still.</span>
            </article>
            <article>
              <div class="law-mark net">→</div>
              <strong>Resultant force</strong>
              <span>When one push wins, the difference is the resultant. The cart moves that way.</span>
            </article>
          </div>

          <div class="tie-back">
            When your thrusters matched, the cart stayed put — zero resultant. When one was bigger, the cart headed toward it. That difference is the net force.
          </div>

          <div class="reward-panel">
            <div class="reward-top">
              <div><span>Discovery distinction</span><strong>{config.rewardLabel}</strong></div>
              <b>+{reward} W</b>
            </div>
            <div class="reward-skills">
              <span class:earned={steadyReady}>Evidence</span>
              <span class:earned={true}>Pattern</span>
              <span class:earned={transferReady}>Transfer</span>
              <span class:earned={!hintUsed}>Independent</span>
            </div>
            <small>Ws are awarded once. The distinction records how you reasoned—not how quickly you tapped.</small>
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
  .solve-first { width: 100%; max-width: 410px; margin: 0 auto; color: var(--qx-text); }
  .mode-head { display: grid; grid-template-columns: 36px 1fr auto; gap: 10px; align-items: center; margin-bottom: 11px; }
  .exit { width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid var(--qx-border); background: var(--qx-surface-2); color: var(--qx-text); font-size: 17px; cursor: pointer; }
  .mode-head div:nth-child(2) { display: flex; flex-direction: column; }
  .mode-head span { color: var(--qx-accent); font-size: 9px; font-weight: 900; letter-spacing: .11em; text-transform: uppercase; }
  .mode-head strong { font-size: 17px; font-weight: 900; }
  .phase-count { color: var(--qx-text-faint); font-size: 11px; font-weight: 900; font-variant-numeric: tabular-nums; }
  .phase-line { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-bottom: 20px; }
  .phase-line span { height: 4px; border-radius: 4px; background: var(--qx-surface-3); }
  .phase-line span.active { background: var(--qx-accent); }
  .phase-line span.done { background: var(--qx-green); }
  .phase { min-height: 410px; display: flex; flex-direction: column; }

  .brief { text-align: center; display: flex; flex-direction: column; align-items: center; }
  .cart-mark { width: 118px; height: 74px; border-radius: 18px; margin: 8px 0 18px; background: var(--qx-text); display: grid; grid-template-columns: 16px 1fr 16px; align-items: center; gap: 9px; padding: 0 14px; box-shadow: var(--qx-shadow-card); }
  .cart-mark .thrust { height: 6px; border-radius: 999px; background: var(--qx-accent); }
  .cart-mark .box { height: 34px; border-radius: 7px; background: var(--qx-bg); }
  .micro-label, .section-title > span, .reveal-kicker { color: var(--qx-accent); font-size: 10px; font-weight: 900; letter-spacing: .11em; text-transform: uppercase; }
  h2 { font-size: 25px; line-height: 1.1; margin: 7px 0 9px; font-weight: 950; }
  p { color: var(--qx-text-dim); font-size: 13.5px; line-height: 1.5; margin: 0; }
  .brief > p { max-width: 32ch; }
  .mission { margin: 20px 0 12px; text-align: left; width: 100%; box-sizing: border-box; border: 1.5px solid var(--qx-accent); border-radius: 14px; padding: 13px 14px; background: var(--qx-accent-soft); }
  .mission span { display: block; color: var(--qx-accent-text); font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; }
  .mission strong { display: block; color: var(--qx-text); margin-top: 4px; font-size: 14px; line-height: 1.4; }
  .brief-rules { display: flex; gap: 5px; flex-wrap: wrap; justify-content: center; margin-bottom: 19px; }
  .brief-rules span { border: 1px solid var(--qx-border); border-radius: 999px; padding: 5px 9px; font-size: 10px; font-weight: 800; color: var(--qx-text-dim); background: var(--qx-surface-2); }

  .primary, .secondary { min-height: 44px; width: 100%; border-radius: 999px; font-family: var(--qx-font); font-size: 14px; font-weight: 900; cursor: pointer; }
  .primary { border: none; background: var(--qx-accent); color: #fff; }
  .primary:disabled { opacity: .42; cursor: not-allowed; }
  .secondary { border: 1.5px solid var(--qx-border-2); background: var(--qx-surface); color: var(--qx-text-dim); }

  .section-title { text-align: left; margin-bottom: 14px; }
  .section-title h2 { font-size: 22px; margin-bottom: 6px; }

  .stage { width: 100%; box-sizing: border-box; min-height: 128px; border: 1.5px solid var(--qx-border); border-radius: 16px; background: linear-gradient(180deg, var(--qx-surface), var(--qx-surface-2)); display: grid; grid-template-columns: 60px 1fr 60px; align-items: center; gap: 8px; padding: 14px 12px; margin-bottom: 10px; }
  .stage.still { border-color: var(--qx-green); }
  .thruster { height: calc(12px + var(--power) * 7px); min-height: 12px; border-radius: 999px; background: var(--qx-accent-soft); border: 1.5px solid var(--qx-accent); position: relative; opacity: calc(.4 + var(--power) * .11); }
  .thruster::after { content: ''; position: absolute; top: 50%; transform: translateY(-50%); border-top: 11px solid transparent; border-bottom: 11px solid transparent; }
  .thruster.left::after { right: -13px; border-left: 13px solid var(--qx-accent); }
  .thruster.right::after { left: -13px; border-right: 13px solid var(--qx-accent); }
  .track { position: relative; height: 74px; border-bottom: 3px solid var(--qx-border-2); display: grid; place-items: center; }
  .bay { position: absolute; bottom: 4px; font-size: 8px; font-weight: 900; letter-spacing: .04em; color: var(--qx-text-faint); border: 1px dashed var(--qx-border-2); border-radius: 6px; padding: 3px 5px; }
  .bay.left-bay { left: 0; }
  .bay.right-bay { right: 0; }
  .bay.hit { color: var(--qx-green-text); border-color: var(--qx-green); border-style: solid; background: var(--qx-green-soft); }
  .cart { width: 62px; height: 38px; border-radius: 8px 8px 5px 5px; background: var(--qx-accent); position: relative; transition: transform .28s ease; }
  .stage.still .cart { background: var(--qx-green); }
  .cart b, .cart::after { content: ''; position: absolute; bottom: -7px; width: 13px; height: 13px; border-radius: 50%; background: var(--qx-text); }
  .cart b { left: 10px; }
  .cart::after { right: 10px; }

  .readout { width: 100%; box-sizing: border-box; display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border: 1px solid var(--qx-border); border-radius: 9px; background: var(--qx-surface-2); margin-bottom: 10px; }
  .readout span { font-size: 9px; font-weight: 900; letter-spacing: .06em; text-transform: uppercase; color: var(--qx-text-faint); }
  .readout strong { font-size: 13px; color: var(--qx-text); text-transform: capitalize; }

  .controls { width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
  .control { border: 1px solid var(--qx-border); border-radius: 10px; background: var(--qx-surface); padding: 10px; display: grid; gap: 6px; justify-items: center; }
  .control span { font-size: 10px; font-weight: 850; color: var(--qx-text-faint); text-transform: uppercase; letter-spacing: .05em; }
  .control strong { font-size: 26px; font-weight: 950; color: var(--qx-text); font-variant-numeric: tabular-nums; }
  .control div { display: flex; gap: 8px; }
  .control button { width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--qx-border-2); background: var(--qx-surface-2); color: var(--qx-text); font: 900 20px/1 var(--qx-font); cursor: pointer; }
  .control button:disabled { opacity: .4; cursor: not-allowed; }

  .test-button { width: 100%; min-height: 44px; border-radius: 10px; border: none; background: var(--qx-text); color: var(--qx-bg); font-family: var(--qx-font); font-size: 13px; font-weight: 900; cursor: pointer; margin-bottom: 10px; }

  .deliver-goals { width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; }
  .deliver-goals div { display: flex; align-items: center; gap: 6px; border: 1.5px solid var(--qx-border); border-radius: 10px; padding: 9px 11px; background: var(--qx-surface-2); font-size: 11px; font-weight: 850; color: var(--qx-text-dim); }
  .deliver-goals div.done { border-color: var(--qx-green); background: var(--qx-green-soft); color: var(--qx-green-text); }
  .deliver-goals b { font-size: 13px; }

  .nudge, .hint { border-radius: 10px; padding: 9px 11px; font-size: 11px; line-height: 1.4; margin-bottom: 7px; }
  .nudge { color: var(--qx-green-text); background: var(--qx-green-soft); }
  .hint { color: var(--qx-accent-text); background: var(--qx-accent-soft); }
  .hint-link { border: none; background: none; color: var(--qx-text-faint); font-family: var(--qx-font); font-size: 11px; font-weight: 800; cursor: pointer; margin: 0 auto 8px; min-height: 30px; }

  .policy-card { display: grid; grid-template-columns: 42px 1fr; gap: 10px; border: 1.5px solid var(--qx-border); border-radius: 14px; padding: 12px; margin-bottom: 10px; background: var(--qx-surface-2); }
  .policy-icon { width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center; background: var(--qx-text); color: var(--qx-bg); font-size: 18px; font-weight: 950; }
  .policy-copy { display: flex; flex-direction: column; }
  .policy-copy small { color: var(--qx-accent); font-size: 8px; font-weight: 900; text-transform: uppercase; letter-spacing: .07em; }
  .policy-copy strong { font-size: 12px; line-height: 1.38; margin-top: 3px; }
  .policy-options { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
  .policy-options button { min-height: 46px; border: 1.5px solid var(--qx-border-2); border-radius: 10px; background: var(--qx-surface); color: var(--qx-text-dim); font: 800 10.5px/1.25 var(--qx-font); padding: 7px; cursor: pointer; }
  .policy-options button.correct { border-color: var(--qx-green); background: var(--qx-green-soft); color: var(--qx-green-text); }
  .policy-options button.wrong { border-color: var(--qx-danger); background: var(--qx-danger-soft); color: var(--qx-danger-text); }

  .reveal { text-align: center; display: flex; flex-direction: column; align-items: center; }
  .reveal h2 { font-size: 21px; }
  .law-reveals { width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 15px 0 10px; }
  .law-reveals article { border: 1.5px solid var(--qx-border); border-radius: 14px; padding: 11px 9px; background: var(--qx-surface-2); display: flex; flex-direction: column; align-items: center; }
  .law-mark { width: 66px; height: 46px; border: 2px solid var(--qx-green); border-radius: 14px; display: grid; place-items: center; background: var(--qx-green-soft); color: var(--qx-green-text); font-size: 18px; font-weight: 950; }
  .law-mark.net { border-color: var(--qx-accent); background: var(--qx-accent-soft); color: var(--qx-accent-text); }
  .law-reveals article > strong { font-size: 12px; margin-top: 7px; }
  .law-reveals article > span { color: var(--qx-text-dim); font-size: 9.5px; line-height: 1.35; margin-top: 3px; min-height: 40px; }
  .tie-back { width: 100%; box-sizing: border-box; border: 1px solid var(--qx-border); border-radius: 12px; padding: 11px 13px; background: var(--qx-surface); color: var(--qx-text-dim); font-size: 11.5px; line-height: 1.5; text-align: left; margin-bottom: 13px; }

  .reward-panel { width: 100%; box-sizing: border-box; border: 1.5px solid var(--qx-green); border-radius: 14px; background: var(--qx-green-soft); padding: 12px; text-align: left; margin-bottom: 13px; }
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
    .phase { min-height: 390px; }
    h2 { font-size: 22px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .cart { transition: none; }
  }
</style>
