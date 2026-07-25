<script>
  // Save the Broadcast — a Solve First network-operations game.
  //
  // Rebuilt after Codex review so the two routing chapters are genuine
  // simulations, not scripted buttons:
  //   1 fit         a whole frame won't fit; split it and deliver in groups
  //   2 order       capacity + travel delay scramble arrival; marks repair it
  //   3 address     a junction forwards by the destination mark, not content
  //   4 resilience  REAL wave dispatch: locked binds one route and stalls at
  //                 the outage; open routes each piece and survives it
  //   T transfer    REAL wave dispatch to a medical machine; town relay fails
  //                 after two of its own deliveries, forcing a genuine reroute
  //   R reveal      only now: packets, sequence numbers, routers, latency,
  //                 bandwidth, packet switching, reassembly, cloud server
  // Every gate is derived from dispatch history, never assigned directly.
  // Discovery language only before the reveal. No written explanation, no timer.
  import { fly, fade } from 'svelte/transition';
  import NetworkTopology from './NetworkTopology.svelte';

  export let config;
  export let onDone = () => {};
  export let onExit = () => {};

  // Reduced-motion: gate the phase transitions so travel animation is removed.
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
  $: flyIn = reduceMotion ? { x: 0, duration: 0 } : { x: 28, duration: 240 };
  $: fadeOut = reduceMotion ? { duration: 0 } : { duration: 90 };

  let phase = 'mission';
  let usedHint = false;
  let activeHint = '';
  let recorded = false;
  let live = '';
  const say = (m) => { live = m; };

  // ---------- phase 1: fit ----------
  const CHANNEL_CAP = 2, FRAME_SIZE = 6;
  let attemptedOversize = false;
  let split = false;
  let tiles = [];
  let selected = [];
  let groupCount = 0;
  $: tilesDelivered = tiles.filter((t) => t.delivered).length;
  $: fitReady = attemptedOversize && split && tilesDelivered === FRAME_SIZE && groupCount >= 3;

  function sendWhole() {
    attemptedOversize = true;
    say(`One large object does not fit. The channel admits ${CHANNEL_CAP} units; this frame needs ${FRAME_SIZE}.`);
  }
  function splitFrame() {
    split = true;
    tiles = Array.from({ length: FRAME_SIZE }, (_, i) => ({ n: i + 1, delivered: false }));
    say('The picture is now six pieces small enough to travel.');
  }
  function toggleTile(n) {
    if (selected.includes(n)) selected = selected.filter((x) => x !== n);
    else if (selected.length < CHANNEL_CAP) selected = [...selected, n];
  }
  function dispatchGroup() {
    if (!selected.length) return;
    const next = tiles.map((t) => (selected.includes(t.n) ? { ...t, delivered: true } : t));
    const nowDelivered = next.filter((t) => t.delivered).length;   // derive from the new array
    tiles = next;
    groupCount += 1;
    selected = [];
    say(nowDelivered >= FRAME_SIZE
      ? 'Six small deliveries rebuilt one complete picture.'
      : 'A smaller piece crossed. The picture can arrive in parts.');
  }

  // ---------- phase 2: order (capacity + delay respected) ----------
  const O_CAP = { upper: 1, lower: 2 };
  const O_TICK = { upper: 1, lower: 3 };
  let o_pieces = [
    { n: 1, route: null, mark: null, arrived: null },
    { n: 2, route: null, mark: null, arrived: null },
    { n: 3, route: null, mark: null, arrived: null }
  ];
  let o_sent = false;
  let witnessedScramble = false;
  let o_useMarks = false;
  $: o_bothRoutes = o_pieces.some((p) => p.route === 'upper') && o_pieces.some((p) => p.route === 'lower');
  $: o_marksUnique = (() => {
    const m = o_pieces.map((p) => p.mark).filter((x) => x != null);
    return m.length === 3 && new Set(m).size === 3;
  })();
  $: o_placement = computeOrderPlacement(o_pieces, o_useMarks);
  $: o_correct = o_useMarks && o_placement.join(',') === '1,2,3';
  $: orderReady = witnessedScramble && o_marksUnique && o_bothRoutes && o_correct;

  function computeOrderPlacement(pieces, useMarks) {
    const sent = pieces.filter((p) => p.arrived != null);
    if (!sent.length) return [];
    if (useMarks && sent.every((p) => p.mark != null)) {
      return [...sent].sort((a, b) => a.mark - b.mark).map((p) => p.n);
    }
    return [...sent].sort((a, b) => a.arrived - b.arrived || a.n - b.n).map((p) => p.n);
  }
  function o_setRoute(n, route) { o_pieces = o_pieces.map((p) => (p.n === n ? { ...p, route } : p)); }
  function o_setMark(n, mark) {
    if (o_pieces.some((p) => p.n !== n && p.mark === mark)) { say('Two pieces cannot claim the same position.'); return; }
    o_pieces = o_pieces.map((p) => (p.n === n ? { ...p, mark } : p));
  }
  function o_send() {
    if (o_pieces.some((p) => !p.route)) { say('Give every piece a route first.'); return; }
    // Arrival = route travel delay + the wave the piece falls into once each
    // route's capacity is filled. A slow, wide route and a fast, narrow one
    // therefore reorder arrivals even though nothing else differs.
    const used = { upper: 0, lower: 0 };
    o_pieces = o_pieces.map((p) => {
      const wave = Math.floor(used[p.route] / O_CAP[p.route]);
      used[p.route] += 1;
      return { ...p, arrived: O_TICK[p.route] + wave };
    });
    o_sent = true;
    const placement = computeOrderPlacement(o_pieces, o_useMarks);
    if (!o_useMarks && placement.join(',') !== '1,2,3') { witnessedScramble = true; say('Arrival order changed the picture.'); }
    else if (o_useMarks && placement.join(',') === '1,2,3') { say('The marks preserved the picture even when arrival order changed.'); }
    else if (!o_useMarks) { say('That arrangement happened to stay in order. Try a low piece on the slow route.'); }
  }
  function o_reset(withMarks) {
    o_pieces = o_pieces.map((p) => ({ ...p, route: null, mark: null, arrived: null }));
    o_sent = false; o_useMarks = withMarks;
    say(withMarks ? 'Add an order mark to each piece, then choose its route.' : 'Transmission reset.');
  }

  // ---------- phase 3: address ----------
  let a_pieces = [
    { n: 1, want: 'A', mark: 'A', delivered: false, stalled: false },
    { n: 2, want: 'A', mark: null, delivered: false, stalled: false },
    { n: 3, want: 'B', mark: 'B', delivered: false, stalled: false },
    { n: 4, want: 'B', mark: null, delivered: false, stalled: false }
  ];
  let a_started = false;
  let witnessedStall = false;
  $: a_toA = a_pieces.some((p) => p.want === 'A' && p.delivered);
  $: a_toB = a_pieces.some((p) => p.want === 'B' && p.delivered);
  $: addressReady = witnessedStall && a_toA && a_toB && a_pieces.every((p) => p.delivered);

  function a_setMark(n, mark) { a_pieces = a_pieces.map((p) => (p.n === n ? { ...p, mark, stalled: false } : p)); }
  function a_startJunction() {
    a_started = true;
    let stalledAny = false, wrongAny = false;
    a_pieces = a_pieces.map((p) => {
      if (p.mark == null) { stalledAny = true; return { ...p, stalled: true, delivered: false }; }
      if (p.mark === p.want) return { ...p, delivered: true, stalled: false };
      wrongAny = true; return { ...p, delivered: false, stalled: false };
    });
    if (stalledAny) witnessedStall = true;
    say(stalledAny ? 'The junction has no basis for choosing an exit.'
      : wrongAny ? 'A piece travelled, but reached the wrong room.'
      : 'The junction used the mark to choose the next route.');
  }

  // ---------- phase 4: resilience (real wave dispatch) ----------
  // Locked mode always binds to the SHORT route — the route that will fail —
  // so the locked trial is guaranteed to demonstrate the defining contrast
  // (traffic stranded on a dead route) rather than quietly succeeding on the
  // survivor. The outage is counted against short-route crossings only, so it
  // can never fire on traffic that never used that route.
  function freshSix() { return Array.from({ length: 6 }, (_, i) => ({ n: i + 1, delivered: false, route: null, viaLongAfterFail: false })); }
  let r_pieces = freshSix();
  let r_mode = null;              // 'locked' | 'open'
  let r_congested = false;
  let r_shortFailed = false;
  let r_shortDelivered = 0;       // crossings on the short route THIS run
  let r_waveMsg = '';
  // history across runs (derived only from what dispatch actually did)
  let sawClear = false, sawCongested = false, sawFailed = false;
  let lockedStalled = false, openReroutedComplete = false;
  let policy = '';
  const SHORT_FAIL_AFTER = 3;
  $: r_undelivered = r_pieces.filter((p) => !p.delivered).length;
  $: resObserved = sawClear && sawCongested && sawFailed;
  // Gate on the EVIDENCE, not merely on having run both modes.
  $: resChoiceActive = lockedStalled && openReroutedComplete && sawClear && sawCongested && sawFailed;
  $: resilienceReady = resChoiceActive && policy === 'open';

  function r_chooseMode(mode) {
    r_mode = mode;
    r_pieces = freshSix(); r_shortFailed = false; r_shortDelivered = 0; r_waveMsg = '';
    say(mode === 'locked'
      ? 'Locked routing. Every piece is bound to the short route.'
      : 'Open routing. Each piece takes an available route.');
  }
  function r_shortCap() { return r_shortFailed ? 0 : r_congested ? 1 : 2; }
  function r_dispatchWave() {
    if (!r_mode) { say('Choose a routing mode first.'); return; }
    const preState = r_shortFailed ? 'failed' : r_congested ? 'congested' : 'clear';
    let shortSlots = r_shortCap();
    let longSlots = 1;                      // the surviving route is narrow
    const delivered = [];
    const next = r_pieces.map((p) => ({ ...p }));
    for (const p of next) {
      if (p.delivered) continue;
      let route = null;
      if (r_mode === 'locked') {
        if (shortSlots > 0) route = 'short';           // bound to the failing route
      } else {
        if (shortSlots > 0) route = 'short';
        else if (longSlots > 0) route = 'long';
      }
      if (!route) continue;
      p.delivered = true; p.route = route;
      if (route === 'short') shortSlots -= 1; else longSlots -= 1;
      if (r_shortFailed && route === 'long') p.viaLongAfterFail = true;
      delivered.push(p.n);
      // outage: the short route fails once it has itself carried three pieces
      if (route === 'short') {
        r_shortDelivered += 1;
        if (r_shortDelivered === SHORT_FAIL_AFTER && !r_shortFailed) { r_shortFailed = true; shortSlots = 0; }
      }
    }
    r_pieces = next;

    // derive observations from what this wave actually did
    if (preState === 'clear' && delivered.length) sawClear = true;
    if (preState === 'congested' && delivered.length) sawCongested = true;
    if (preState === 'failed') sawFailed = true;

    const remaining = next.filter((p) => !p.delivered).length;
    if (r_mode === 'locked') {
      if (r_shortFailed && remaining > 0 && delivered.length === 0) {
        lockedStalled = true;
        r_waveMsg = `The short route is down. ${remaining} pieces are stuck — locked routing cannot move them.`;
      } else { r_waveMsg = `${delivered.length} piece(s) crossed. ${remaining} to go.`; }
    } else {
      if (remaining === 0) {
        if (next.some((p) => p.viaLongAfterFail)) openReroutedComplete = true;
        r_waveMsg = next.some((p) => p.viaLongAfterFail)
          ? 'Open routing delivered every piece — the last ones took the surviving route.'
          : 'Open routing delivered every piece.';
      } else { r_waveMsg = `${delivered.length} piece(s) crossed. ${remaining} to go.`; }
    }
  }
  function r_toggleCongestion() { r_congested = !r_congested; say(r_congested ? 'The short route is busy: its capacity drops to one per dispatch.' : 'Congestion cleared.'); }
  function choosePolicy(p) {
    policy = p;
    say(p === 'open' ? 'The picture survived because its pieces were free to take different routes.' : 'Every piece bound to the failed route is stuck.');
  }

  // ---------- transfer: clinic (real wave dispatch) ----------
  // Deadlock-proofing: the town relay fails after TOWN_FAIL_AFTER of its own
  // deliveries, so the launch configuration must put strictly more than that
  // on town (>= 3) and keep at least one on hill. That guarantees a genuinely
  // stranded town segment at the moment of failure, for every valid start.
  // The requirement is stated in the mission UI, not hidden in validation, and
  // `Reset transfer` makes any configuration recoverable.
  const TOWN_FAIL_AFTER = 2, TOWN_MIN = 3, HILL_MIN = 1, TOWN_CAP = 1, HILL_CAP = 3;
  function freshClinic() { return Array.from({ length: 5 }, (_, i) => ({ n: i + 1, dest: null, mark: null, route: null, delivered: false, stalled: false, wasTown: false })); }
  let t_pieces = freshClinic();
  let t_townFailed = false, t_townDelivered = 0, t_reroute = false, t_started = false;
  $: t_correctDest = t_pieces.every((p) => p.dest === 'machine');
  $: t_marks = t_pieces.map((p) => p.mark);
  $: t_fiveOrders = t_marks.filter((x) => x != null).length === 5 && new Set(t_marks.filter((x) => x != null)).size === 5;
  $: t_allDelivered = t_pieces.every((p) => p.delivered);
  $: t_townAssigned = t_pieces.filter((p) => p.route === 'town').length;
  $: t_hillAssigned = t_pieces.filter((p) => p.route === 'hill').length;
  // Enforced only for the launch configuration; after the first dispatch the
  // distribution legitimately changes as segments are delivered or redirected.
  $: t_configOk = t_townAssigned >= TOWN_MIN && t_hillAssigned >= HILL_MIN;
  $: t_canDispatch = !t_allDelivered && (t_started || t_configOk);
  $: t_redirectable = t_townFailed && t_pieces.some((p) => !p.delivered && p.route === 'town');
  $: transferReady = t_correctDest && t_fiveOrders && t_reroute && t_allDelivered;

  // Delivered segments are frozen so the evidence history stays coherent.
  function t_setDest(n) { t_pieces = t_pieces.map((p) => (p.n === n && !p.delivered ? { ...p, dest: 'machine', stalled: false } : p)); }
  function t_setMark(n, mark) {
    const target = t_pieces.find((p) => p.n === n);
    if (!target || target.delivered) return;
    if (t_pieces.some((p) => p.n !== n && p.mark === mark)) { say(`Order position ${mark} is already taken by another segment.`); return; }
    t_pieces = t_pieces.map((p) => (p.n === n ? { ...p, mark } : p));
  }
  function t_setRoute(n, route) { t_pieces = t_pieces.map((p) => (p.n === n && !p.delivered ? { ...p, route, stalled: false } : p)); }
  function t_dispatch() {
    if (!t_canDispatch) {
      say(`The launch plan needs at least ${TOWN_MIN} segments on the town relay and ${HILL_MIN} on the hill relay.`);
      return;
    }
    t_started = true;
    let townSlots = t_townFailed ? 0 : TOWN_CAP;   // fast but capacity one
    let hillSlots = HILL_CAP;                      // slow but capacity three
    const next = t_pieces.map((p) => ({ ...p }));
    let anyStall = false;
    for (const p of next) {
      if (p.delivered) continue;
      if (p.dest !== 'machine' || p.mark == null || !p.route) { p.stalled = true; anyStall = true; continue; }
      if (p.route === 'town') {
        // town processing stops the instant the relay is down
        if (t_townFailed || townSlots <= 0) { p.stalled = true; anyStall = true; continue; }
        townSlots -= 1; p.delivered = true; p.stalled = false; t_townDelivered += 1;
        if (t_townDelivered === TOWN_FAIL_AFTER && !t_townFailed) { t_townFailed = true; townSlots = 0; }
      } else {
        if (hillSlots <= 0) { p.stalled = true; anyStall = true; continue; }
        hillSlots -= 1; p.delivered = true; p.stalled = false;
        if (p.wasTown) t_reroute = true;    // a town-bound piece redirected to hill and delivered
      }
    }
    t_pieces = next;
    if (t_townFailed && next.some((p) => !p.delivered && p.route === 'town')) say('The town relay failed. Redirect its undelivered segments through the hill relay.');
    else if (anyStall) say('Some segments stalled — check destination, order, and an available route.');
    else if (next.every((p) => p.delivered)) say('Full ordered trace reconstructed at the machine.');
    else say('Segments delivered.');
  }
  function t_redirect() {
    if (!t_redirectable) return;
    t_pieces = t_pieces.map((p) => (!p.delivered && p.route === 'town' ? { ...p, route: 'hill', wasTown: true, stalled: false } : p));
    say('Undelivered town segments redirected to the hill relay. Dispatch again to deliver them.');
  }
  function t_reset() {
    t_pieces = freshClinic();
    t_townFailed = false; t_townDelivered = 0; t_reroute = false; t_started = false;
    say('Transfer reset. The town relay is back up and every segment is at the clinic.');
  }

  // ---------- reward ----------
  $: evidenceScore =
    (attemptedOversize ? 1 : 0) +
    (o_bothRoutes ? 1 : 0) +
    (a_toA && a_toB ? 1 : 0) +
    (resObserved && lockedStalled && openReroutedComplete ? 1 : 0);
  $: transferScore = (t_correctDest ? 1 : 0) + (t_fiveOrders ? 1 : 0) + (t_reroute ? 1 : 0);
  $: reward = Math.min(15, 6 + evidenceScore + transferScore + (usedHint ? 0 : 2));

  function showHint(key, msg) { usedHint = true; activeHint = activeHint === key ? '' : key; if (activeHint === key) say(msg); }

  function finishDiscovery() {
    if (!transferReady) return;
    phase = 'reveal';
    if (!recorded) {
      recorded = true;
      onDone({
        id: config.id, reward,
        evidenceCount: tilesDelivered + t_pieces.filter((p) => p.delivered).length,
        patternFound: true, compared: true,
        transferFirstTry: transferScore === 3, usedHint
      });
    }
  }

  function restart() {
    phase = 'mission'; usedHint = false; activeHint = ''; recorded = false; live = '';
    attemptedOversize = false; split = false; tiles = []; selected = []; groupCount = 0;
    o_pieces = o_pieces.map((p) => ({ ...p, route: null, mark: null, arrived: null })); o_sent = false; witnessedScramble = false; o_useMarks = false;
    a_pieces = [
      { n: 1, want: 'A', mark: 'A', delivered: false, stalled: false },
      { n: 2, want: 'A', mark: null, delivered: false, stalled: false },
      { n: 3, want: 'B', mark: 'B', delivered: false, stalled: false },
      { n: 4, want: 'B', mark: null, delivered: false, stalled: false }
    ]; a_started = false; witnessedStall = false;
    r_pieces = freshSix(); r_mode = null; r_congested = false; r_shortFailed = false; r_shortDelivered = 0; r_waveMsg = '';
    sawClear = false; sawCongested = false; sawFailed = false; lockedStalled = false; openReroutedComplete = false; policy = '';
    t_reset();
  }

  const STEPS = ['fit', 'order', 'address', 'resilience', 'transfer', 'reveal'];
  $: stepIndex = phase === 'mission' ? 0 : STEPS.indexOf(phase) + 1;
  const slots6 = (nums) => Array.from({ length: 6 }, (_, i) => nums.includes(i + 1));
</script>

<div class="solve-first">
  <header class="mode-head">
    <button class="exit" on:click={onExit} aria-label="Return to workshop practice">←</button>
    <div><span>{config.eyebrow}</span><strong>Solve First</strong></div>
    <div class="phase-count">{stepIndex}/6</div>
  </header>

  <div class="phase-line" aria-label="Discovery progress">
    {#each STEPS as item, i}<span class:active={phase === item} class:done={stepIndex > i + 1}></span>{/each}
  </div>

  <div class="sr-live" aria-live="polite">{live}</div>

  {#key phase}
    <section class="phase" in:fly={flyIn} out:fade={fadeOut}>

      {#if phase === 'mission'}
        <div class="brief">
          <div class="cart-mark" aria-hidden="true"><span class="wave"></span></div>
          <div class="micro-label">Live event · Channel unstable</div>
          <h2>Save the Broadcast</h2>
          <p>A live picture must reach the broadcast room. The direct channel cannot carry the whole frame, and the route is becoming unstable. Keep the picture on air.</p>
          <div class="mission">
            <span>Your mission</span>
            <strong>Deliver all six pieces, preserve the correct picture, and keep transmitting when a route fails.</strong>
          </div>
          <div class="brief-rules"><span>Failed sends are free</span><span>Evidence unlocks the next control</span><span>The names come last</span></div>
          <button class="primary" on:click={() => phase = 'fit'}>Open transmission control</button>
        </div>

      {:else if phase === 'fit'}
        <div class="section-title"><span>Transmission 01 · Too large</span><h2>Make the message fit</h2>
          <p>One channel connects the sender and the broadcast room. It admits {CHANNEL_CAP} units per dispatch. Your frame is {FRAME_SIZE}.</p></div>

        <div class="receiver-img" aria-label="Broadcast image, {tilesDelivered} of 6 pieces delivered">
          {#each slots6(tiles.filter((t) => t.delivered).map((t) => t.n)) as filled, i}<span class:filled>{filled ? i + 1 : ''}</span>{/each}
        </div>

        {#if !split}
          <button class="test-button" on:click={sendWhole}>Send the whole frame</button>
          {#if attemptedOversize}
            <div class="report">One large object does not fit. <strong>The channel admits {CHANNEL_CAP}; this frame needs {FRAME_SIZE}.</strong></div>
            <button class="primary" on:click={splitFrame}>Split frame</button>
          {:else}<div class="nudge">Try sending the whole picture first. See what the channel does.</div>{/if}
        {:else}
          <div class="tile-tray" role="group" aria-label="Picture pieces at the sender">
            {#each tiles as t}
              <button class="tile" class:sent={t.delivered} class:sel={selected.includes(t.n)} disabled={t.delivered}
                on:click={() => toggleTile(t.n)} aria-pressed={selected.includes(t.n)}
                aria-label={`Piece ${t.n}${t.delivered ? ', delivered' : selected.includes(t.n) ? ', selected' : ''}`}>{t.n}</button>
            {/each}
          </div>
          <div class="tray-note">Group up to {CHANNEL_CAP} pieces, then dispatch. Groups sent: {groupCount}.</div>
          <button class="test-button" on:click={dispatchGroup} disabled={!selected.length}>Dispatch group ({selected.length}/{CHANNEL_CAP})</button>
        {/if}

        <button class="hint-link" on:click={() => showHint('fit', 'Compare the frame size with what the channel admits at once.')}>{activeHint === 'fit' ? 'Hide nudge' : 'Need a nudge?'}</button>
        {#if activeHint === 'fit'}<div class="hint">Compare the frame size with what the channel admits at once.</div>{/if}
        <button class="primary" disabled={!fitReady} on:click={() => phase = 'order'}>{fitReady ? 'Picture restored · Test the markings' : 'Split, then deliver all six in groups'}</button>

      {:else if phase === 'order'}
        <div class="section-title"><span>Transmission 02 · Mixed arrival</span><h2>Rebuild it correctly</h2>
          <p>Two routes now connect you. The upper route is quick but narrow (capacity 1); the lower is slower but wider (capacity 2).</p></div>

        <NetworkTopology caption={`Two routes; ${o_sent ? 'pieces sent' : 'ready'}`}
          nodes={[{ id: 's', label: 'sender', x: 40, y: 88, role: 'sender' }, { id: 'r', label: 'room', x: 260, y: 88, role: 'receiver' }]}
          routes={[{ id: 'upper', a: 's', b: 'r', cap: 1, tick: 1, state: 'clear', mark: 'upper' }, { id: 'lower', a: 's', b: 'r', cap: 2, tick: 3, state: 'clear', mark: 'lower' }]}
          pieces={o_pieces.map((p) => ({ id: 'o' + p.n, label: p.mark ?? p.n, nodeId: p.arrived != null ? 'r' : 's', tone: p.arrived != null ? 'done' : 'pending' }))} />

        <div class="receiver-img small" aria-label="Rebuilt picture order">
          {#each o_placement as n, i}<span class="filled" class:wrong={!o_useMarks && n !== i + 1}>{n}</span>{/each}
          {#each Array(Math.max(0, 3 - o_placement.length)) as _}<span></span>{/each}
        </div>

        {#each o_pieces as p}
          <div class="piece-row">
            <b>Piece {p.n}</b>
            <div class="chips-wrap">
              {#if o_useMarks}
                <div class="mark-chips">{#each [1, 2, 3] as m}<button class:on={p.mark === m} on:click={() => o_setMark(p.n, m)} aria-label={`Order mark ${m} for piece ${p.n}`}>{m}</button>{/each}</div>
              {/if}
              <div class="route-chips">
                <button class:on={p.route === 'upper'} on:click={() => o_setRoute(p.n, 'upper')} aria-label={`Upper route for piece ${p.n}`}>upper</button>
                <button class:on={p.route === 'lower'} on:click={() => o_setRoute(p.n, 'lower')} aria-label={`Lower route for piece ${p.n}`}>lower</button>
              </div>
            </div>
          </div>
        {/each}

        <div class="row-2"><button class="test-button" on:click={o_send}>Send pieces</button><button class="test-button ghost" on:click={() => o_reset(witnessedScramble)}>Reset</button></div>

        {#if o_sent && !o_useMarks && witnessedScramble}<div class="report">Arrival order changed the picture. <strong>Reset and add order marks.</strong></div>
        {:else if o_correct}<div class="report ok">The marks preserved the picture even when arrival order changed.</div>{/if}

        <button class="hint-link" on:click={() => showHint('order', 'The receiver sees arrival order. What information would preserve intended order?')}>{activeHint === 'order' ? 'Hide nudge' : 'Need a nudge?'}</button>
        {#if activeHint === 'order'}<div class="hint">The receiver sees arrival order. What information would preserve intended order?</div>{/if}
        <button class="primary" disabled={!orderReady} on:click={() => phase = 'address'}>{orderReady ? 'Order secured · Add a destination' : 'Witness the scramble, then repair it with marks on both routes'}</button>

      {:else if phase === 'address'}
        <div class="section-title"><span>Transmission 03 · Two receivers</span><h2>Send to the right room</h2>
          <p>Two rooms share one junction: Broadcast Room A (△) and Archive Room B (▢). Mark each piece for its room.</p></div>

        <NetworkTopology caption="Junction routes pieces to Room A or Room B"
          nodes={[{ id: 's', label: 'sender', x: 40, y: 88, role: 'sender' }, { id: 'j', label: 'junction', x: 150, y: 88, role: 'junction' }, { id: 'A', label: 'Room A △', x: 260, y: 44, role: 'receiver' }, { id: 'B', label: 'Room B ▢', x: 260, y: 132, role: 'receiver' }]}
          routes={[{ id: 'sa', a: 's', b: 'j', cap: 2, tick: 1, state: 'clear' }, { id: 'ja', a: 'j', b: 'A', cap: 2, tick: 1, state: 'clear' }, { id: 'jb', a: 'j', b: 'B', cap: 2, tick: 1, state: 'clear' }]}
          pieces={a_pieces.map((p) => ({ id: 'a' + p.n, label: p.n, nodeId: p.delivered ? p.want : p.stalled ? 'j' : 's', tone: p.delivered ? 'done' : p.stalled ? 'stalled' : 'pending' }))} />

        {#each a_pieces as p}
          <div class="piece-row">
            <b>Piece {p.n}{p.delivered ? ' ✓' : p.stalled ? ' · stalled' : ''}</b>
            <div class="mark-chips wide">
              <button class:on={p.mark === 'A'} on:click={() => a_setMark(p.n, 'A')} aria-label={`Mark piece ${p.n} for Room A`}>△ Room A</button>
              <button class:on={p.mark === 'B'} on:click={() => a_setMark(p.n, 'B')} aria-label={`Mark piece ${p.n} for Room B`}>▢ Room B</button>
            </div>
          </div>
        {/each}

        <button class="test-button" on:click={a_startJunction}>Start the junction</button>
        {#if a_started && a_pieces.some((p) => p.stalled)}<div class="report">The junction has no basis for choosing an exit. <strong>Mark the stalled piece.</strong></div>
        {:else if addressReady}<div class="report ok">The junction used the mark to choose the next route — for both rooms.</div>{/if}

        <button class="primary" disabled={!addressReady} on:click={() => phase = 'resilience'}>{addressReady ? 'Both rooms supplied · Stress-test the route' : 'Route to both rooms; fix the stalled piece'}</button>

      {:else if phase === 'resilience'}
        <div class="section-title"><span>Transmission 04 · Route failure</span><h2>Survive congestion and failure</h2>
          <p>Back to one room and the full six-piece broadcast. Two routing modes are available. Run both, and see all three route conditions, before you commit.</p></div>

        <NetworkTopology caption={`Network: ${r_shortFailed ? 'short route down' : r_congested ? 'short route busy' : 'clear'}; ${r_undelivered} pieces waiting`}
          nodes={[{ id: 's', label: 'sender', x: 40, y: 88, role: 'sender' }, { id: 'r', label: 'room', x: 260, y: 88, role: 'receiver' }]}
          routes={[{ id: 'short', a: 's', b: 'r', cap: r_shortCap(), tick: r_congested ? 2 : 1, state: r_shortFailed ? 'failed' : r_congested ? 'congested' : 'clear' }, { id: 'long', a: 's', b: 'r', cap: 1, tick: 3, state: 'clear' }]}
          pieces={r_pieces.map((p) => ({ id: 'r' + p.n, label: p.n, nodeId: p.delivered ? 'r' : 's', tone: p.delivered ? 'done' : (r_shortFailed && r_mode === 'locked') ? 'stalled' : 'pending' }))} />

        <div class="mode-row">
          <button class="mode-btn" class:on={r_mode === 'locked'} on:click={() => r_chooseMode('locked')}>Locked route</button>
          <button class="mode-btn" class:on={r_mode === 'open'} on:click={() => r_chooseMode('open')}>Open route</button>
          <button class="mode-btn wide" class:on={r_congested} on:click={r_toggleCongestion}>{r_congested ? 'Congestion on' : 'Add congestion'}</button>
        </div>
        <div class="tray-note">Locked routing binds every piece to the short route. Open routing lets each piece take whichever route is free.</div>

        <button class="test-button" on:click={r_dispatchWave} disabled={!r_mode || r_undelivered === 0}>Dispatch wave</button>
        {#if r_waveMsg}<div class="report" class:ok={r_undelivered === 0 && r_mode === 'open'}>{r_waveMsg}</div>{/if}

        <div class="cond-row" aria-hidden="true">
          <span class:on={sawClear}>clear ✓</span><span class:on={sawCongested}>busy ✓</span><span class:on={sawFailed}>down ✓</span>
          <span class:on={lockedStalled}>locked stalled ✓</span><span class:on={openReroutedComplete}>open rerouted ✓</span>
        </div>

        {#if resChoiceActive}
          <div class="policy-q">For the outage, choose the operating policy:</div>
          <div class="policy-opts">
            <button class:sel={policy === 'locked'} class:wrong={policy === 'locked'} on:click={() => choosePolicy('locked')}>Keep every piece on the original route</button>
            <button class:sel={policy === 'open'} class:correct={policy === 'open'} on:click={() => choosePolicy('open')}>Let each piece use an available route</button>
          </div>
        {:else}<div class="nudge">Strand the locked run on the failed route, then let an open run carry the rest through the survivor. Add congestion along the way.</div>{/if}

        <button class="hint-link" on:click={() => showHint('res', 'A route choice made for the whole message cannot react piece by piece.')}>{activeHint === 'res' ? 'Hide nudge' : 'Need a nudge?'}</button>
        {#if activeHint === 'res'}<div class="hint">A route choice made for the whole message cannot react piece by piece.</div>{/if}
        <button class="primary" disabled={!resilienceReady} on:click={() => phase = 'transfer'}>{resilienceReady ? 'Broadcast protected · Transfer' : 'Strand a locked run, reroute an open one, then choose'}</button>

      {:else if phase === 'transfer'}
        <div class="section-title"><span>Transfer · Emergency telemetry</span><h2>Restore the heart trace</h2>
          <p>A field clinic must reach a remote medical machine with five heart-monitor segments, through a town relay (fast, capacity 1) and a hill relay (slower, capacity 3).</p></div>

        <NetworkTopology caption={`Clinic to medical machine; town relay ${t_townFailed ? 'down' : 'up'}`}
          nodes={[{ id: 's', label: 'clinic', x: 38, y: 88, role: 'sender' }, { id: 'town', label: 'town', x: 150, y: 44, role: 'relay' }, { id: 'hill', label: 'hill', x: 150, y: 132, role: 'relay' }, { id: 'm', label: 'machine', x: 262, y: 88, role: 'receiver' }]}
          routes={[{ id: 'townr', a: 's', b: 'town', cap: 1, tick: 1, state: t_townFailed ? 'failed' : 'clear' }, { id: 'townm', a: 'town', b: 'm', cap: 1, tick: 1, state: t_townFailed ? 'failed' : 'clear' }, { id: 'hillr', a: 's', b: 'hill', cap: 3, tick: 3, state: 'clear' }, { id: 'hillm', a: 'hill', b: 'm', cap: 3, tick: 3, state: 'clear' }]}
          pieces={t_pieces.map((p) => ({ id: 't' + p.n, label: p.mark ?? p.n, nodeId: p.delivered ? 'm' : 's', tone: p.delivered ? 'done' : p.stalled ? 'stalled' : 'pending' }))} />

        <div class="receiver-img small" aria-label="Heart trace segments delivered, by order mark">
          {#each Array(5) as _, i}<span class:filled={t_pieces.find((p) => p.mark === i + 1)?.delivered}>{i + 1}</span>{/each}
        </div>

        {#if !t_started}
          <div class="mission compact">
            <span>Launch plan required</span>
            <strong>The clinic will only release the transfer with at least {TOWN_MIN} segments booked on the town relay and at least {HILL_MIN} on the hill relay.</strong>
            <em>Booked now — town {t_townAssigned}/{TOWN_MIN} · hill {t_hillAssigned}/{HILL_MIN}</em>
          </div>
        {/if}

        {#each t_pieces as p}
          <div class="piece-row col">
            <b>Seg {p.n}{p.delivered ? ' ✓ delivered' : p.stalled ? ' · stalled' : ''}</b>
            <div class="chips-wrap">
              {#if p.dest !== 'machine'}
                <button class="mini" disabled={p.delivered} on:click={() => t_setDest(p.n)} aria-label={`Give segment ${p.n} its destination mark`}>add destination</button>
              {/if}
              <div class="mark-chips">{#each [1, 2, 3, 4, 5] as m}<button class:on={p.mark === m} disabled={p.delivered} on:click={() => t_setMark(p.n, m)} aria-label={`Order mark ${m} for segment ${p.n}`}>{m}</button>{/each}</div>
              <div class="route-chips">
                <button class:on={p.route === 'town'} disabled={p.delivered || t_townFailed} on:click={() => t_setRoute(p.n, 'town')} aria-label={`Town relay for segment ${p.n}`}>town</button>
                <button class:on={p.route === 'hill'} disabled={p.delivered} on:click={() => t_setRoute(p.n, 'hill')} aria-label={`Hill relay for segment ${p.n}`}>hill</button>
              </div>
            </div>
          </div>
        {/each}

        <div class="row-2"><button class="test-button" on:click={t_dispatch} disabled={!t_canDispatch}>Dispatch</button>
          <button class="test-button ghost" on:click={t_redirect} disabled={!t_redirectable}>Redirect via hill</button></div>
        <button class="test-button ghost" on:click={t_reset}>Reset transfer</button>

        {#if !t_started && !t_configOk}<div class="report">Book at least {TOWN_MIN} segments on the town relay and {HILL_MIN} on the hill relay before dispatching.</div>
        {:else if t_townFailed && !t_allDelivered}<div class="report">Town relay down. <strong>Redirect the undelivered segments through the hill relay, then dispatch.</strong></div>
        {:else if transferReady}<div class="report ok">Full ordered trace reconstructed at the machine.</div>{/if}

        <button class="hint-link" on:click={() => showHint('tr', 'Check destination, order, and available route as three separate jobs.')}>{activeHint === 'tr' ? 'Hide nudge' : 'Need a nudge?'}</button>
        {#if activeHint === 'tr'}<div class="hint">Check destination, order, and available route as three separate jobs.</div>{/if}
        <button class="primary" disabled={!transferReady} on:click={finishDiscovery}>{transferReady ? 'Reveal the system' : 'Mark, order, and reroute all five segments'}</button>

      {:else if phase === 'reveal'}
        <div class="reveal">
          <div class="reveal-kicker">The system has a name</div>
          <h2>You built a packet-switched network.</h2>
          <p>A network splits data into packets. Each packet carries information that helps routers forward it and helps the receiver rebuild the original message.</p>
          <div class="diagram" aria-label="sender to packets to routers with multiple paths to remote server to reassembled data">sender → <b>packets</b> → routers / multiple paths → remote server → reassembled data</div>
          <ul class="reveal-list">
            <li><strong>Packets</strong> — the six picture pieces that fitted through the channel.</li>
            <li><strong>Sequence numbers</strong> — the order marks that repaired mixed arrival.</li>
            <li><strong>Destination addresses</strong> — the marks the junction used to choose an exit.</li>
            <li><strong>Routers</strong> — the junctions that forwarded pieces without reading their content.</li>
            <li><strong>Latency</strong> — the travel delay you measured in ticks.</li>
            <li><strong>Bandwidth</strong> — how many pieces a route carried in one dispatch.</li>
            <li><strong>Packet switching</strong> — letting different pieces use whichever route was available.</li>
            <li><strong>Reassembly</strong> — rebuilding the picture and the heart trace at the destination.</li>
            <li><strong>Cloud server</strong> — the remote machine was a real computer reached across the network, not an immaterial place.</li>
          </ul>
          <div class="misconceptions">
            <span>The internet is not one giant machine; it is connected networks.</span>
            <span>The shortest route is not always the usable route.</span>
            <span>Later arrival is not corrupted data when the ordering information is intact.</span>
            <span>Cloud services still run on physical remote computers.</span>
          </div>
          <div class="reward-panel">
            <div class="reward-top"><div><span>Discovery distinction</span><strong>{config.rewardLabel}</strong></div><b>+{reward} W</b></div>
            <div class="reward-skills"><span class:earned={evidenceScore >= 3}>Evidence</span><span class:earned={true}>Pattern</span><span class:earned={transferScore >= 2}>Transfer</span><span class:earned={!usedHint}>Independent</span></div>
            <small>Ws are awarded once. The distinction records how you reasoned—not how quickly you tapped.</small>
          </div>
          <div class="reveal-actions"><button class="primary" on:click={onExit}>Return to workshops</button><button class="secondary" on:click={restart}>Play again</button></div>
        </div>
      {/if}
    </section>
  {/key}
</div>

<style>
  .solve-first { width: 100%; max-width: 410px; margin: 0 auto; color: var(--qx-text); }
  .sr-live { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  .mode-head { display: grid; grid-template-columns: 44px 1fr auto; gap: 10px; align-items: center; margin-bottom: 11px; }
  .exit { width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid var(--qx-border); background: var(--qx-surface-2); color: var(--qx-text); font-size: 18px; cursor: pointer; }
  .mode-head div:nth-child(2) { display: flex; flex-direction: column; }
  .mode-head span { color: var(--qx-accent); font-size: 9px; font-weight: 900; letter-spacing: .11em; text-transform: uppercase; }
  .mode-head strong { font-size: 17px; font-weight: 900; }
  .phase-count { color: var(--qx-text-faint); font-size: 11px; font-weight: 900; font-variant-numeric: tabular-nums; }
  .phase-line { display: grid; grid-template-columns: repeat(6, 1fr); gap: 4px; margin-bottom: 16px; }
  .phase-line span { height: 4px; border-radius: 4px; background: var(--qx-surface-3); }
  .phase-line span.active { background: var(--qx-accent); }
  .phase-line span.done { background: var(--qx-green); }
  .phase { min-height: 420px; display: flex; flex-direction: column; }

  .brief { text-align: center; display: flex; flex-direction: column; align-items: center; }
  .cart-mark { width: 96px; height: 96px; border-radius: 26px; margin: 8px 0 18px; background: var(--qx-surface-elevated); display: grid; place-items: center; box-shadow: var(--qx-shadow-card); }
  .cart-mark .wave { width: 20px; height: 20px; border-radius: 50%; background: var(--qx-accent); box-shadow: 0 0 0 8px var(--qx-accent-soft), 0 0 0 16px var(--qx-accent-soft-2); }
  .micro-label, .section-title > span, .reveal-kicker { color: var(--qx-accent); font-size: 10px; font-weight: 900; letter-spacing: .11em; text-transform: uppercase; }
  h2 { font-size: 23px; line-height: 1.12; margin: 7px 0 9px; font-weight: 950; }
  p { color: var(--qx-text-dim); font-size: 13px; line-height: 1.5; margin: 0; }
  .brief > p { max-width: 33ch; }
  .mission { margin: 18px 0 12px; text-align: left; width: 100%; box-sizing: border-box; border: 1.5px solid var(--qx-accent); border-radius: 14px; padding: 13px 14px; background: var(--qx-accent-soft); }
  .mission span { display: block; color: var(--qx-accent-text); font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; }
  .mission strong { display: block; color: var(--qx-text); margin-top: 4px; font-size: 14px; line-height: 1.4; }
  .mission.compact { margin: 0 0 10px; padding: 10px 12px; }
  .mission.compact strong { font-size: 12px; }
  .mission.compact em { display: block; margin-top: 5px; font-style: normal; font-size: 11px; font-weight: 850; color: var(--qx-accent-text); font-variant-numeric: tabular-nums; }
  .brief-rules { display: flex; gap: 5px; flex-wrap: wrap; justify-content: center; margin-bottom: 19px; }
  .brief-rules span { border: 1px solid var(--qx-border); border-radius: 999px; padding: 5px 9px; font-size: 10px; font-weight: 800; color: var(--qx-text-dim); background: var(--qx-surface-2); }

  .primary, .secondary { min-height: 44px; width: 100%; border-radius: 999px; font-family: var(--qx-font); font-size: 13.5px; font-weight: 900; cursor: pointer; }
  .primary { border: none; background: var(--qx-accent); color: var(--qx-bg); }
  .primary:disabled { opacity: .42; cursor: not-allowed; }
  .secondary { border: 1.5px solid var(--qx-border-2); background: var(--qx-surface); color: var(--qx-text-dim); }

  .section-title { text-align: left; margin-bottom: 11px; }
  .section-title h2 { font-size: 20px; margin-bottom: 6px; }

  .receiver-img { width: 100%; max-width: 220px; margin: 0 auto 11px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }
  .receiver-img.small { max-width: 190px; grid-template-columns: repeat(5, 1fr); }
  .receiver-img span { aspect-ratio: 1; border: 1.5px solid var(--qx-border); border-radius: 8px; background: var(--qx-surface-2); display: grid; place-items: center; font-size: 13px; font-weight: 950; color: var(--qx-text-faint); }
  .receiver-img span.filled { border-color: var(--qx-green); background: var(--qx-green-soft); color: var(--qx-green-text); }
  .receiver-img span.wrong { border-color: var(--qx-danger); background: var(--qx-danger-soft); color: var(--qx-danger-text); }

  .tile-tray { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; margin-bottom: 8px; }
  .tile { min-height: 44px; border: 1.5px solid var(--qx-border-2); border-radius: 9px; background: var(--qx-surface); color: var(--qx-text); font: 950 15px/1 var(--qx-font); cursor: pointer; }
  .tile.sel { border-color: var(--qx-accent); background: var(--qx-accent-soft); color: var(--qx-accent-text); }
  .tile.sent { border-color: var(--qx-green); background: var(--qx-green-soft); color: var(--qx-green-text); }
  .tile:disabled { cursor: default; }
  .tray-note { font-size: 10.5px; color: var(--qx-text-faint); font-weight: 800; text-align: center; margin-bottom: 8px; }

  .test-button { width: 100%; min-height: 44px; border-radius: 10px; border: none; background: var(--qx-text); color: var(--qx-bg); font-family: var(--qx-font); font-size: 13px; font-weight: 900; cursor: pointer; margin-bottom: 9px; }
  .test-button.ghost { background: var(--qx-surface-2); color: var(--qx-text-dim); border: 1.5px solid var(--qx-border-2); }
  .test-button:disabled { opacity: .45; cursor: not-allowed; }
  .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

  .piece-row { display: grid; grid-template-columns: auto 1fr; gap: 8px; align-items: center; border: 1px solid var(--qx-border); border-radius: 10px; padding: 8px 10px; background: var(--qx-surface-2); margin-bottom: 7px; }
  .piece-row.col { grid-template-columns: 1fr; }
  .piece-row b { font-size: 11px; }
  .chips-wrap { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; align-items: center; }
  .piece-row.col .chips-wrap { justify-content: flex-start; margin-top: 5px; }
  .mark-chips, .route-chips { display: flex; gap: 5px; flex-wrap: wrap; }
  .piece-row button { min-height: 44px; min-width: 44px; border: 1.5px solid var(--qx-border-2); border-radius: 9px; background: var(--qx-surface); color: var(--qx-text-dim); font: 850 11px/1 var(--qx-font); padding: 0 10px; cursor: pointer; }
  .piece-row button.on { border-color: var(--qx-accent); background: var(--qx-accent-soft); color: var(--qx-accent-text); }
  .piece-row button:disabled { opacity: .4; cursor: not-allowed; }
  .piece-row .mini { border-color: var(--qx-accent); color: var(--qx-accent-text); }

  .report { width: 100%; box-sizing: border-box; border-radius: 10px; padding: 10px 12px; font-size: 11.5px; line-height: 1.45; margin: 3px 0 9px; background: var(--qx-accent-soft); color: var(--qx-accent-text); }
  .report.ok { background: var(--qx-green-soft); color: var(--qx-green-text); }
  .report strong { font-weight: 950; }
  .nudge, .hint { border-radius: 10px; padding: 9px 11px; font-size: 11px; line-height: 1.4; margin-bottom: 7px; }
  .nudge { color: var(--qx-green-text); background: var(--qx-green-soft); }
  .hint { color: var(--qx-accent-text); background: var(--qx-accent-soft); }
  .hint-link { border: none; background: none; color: var(--qx-text-faint); font-family: var(--qx-font); font-size: 11px; font-weight: 800; cursor: pointer; margin: 0 auto 8px; min-height: 44px; }

  .mode-row { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-bottom: 8px; }
  .mode-btn { min-height: 44px; border: 1.5px solid var(--qx-border-2); border-radius: 10px; background: var(--qx-surface); color: var(--qx-text-dim); font: 850 12px/1.1 var(--qx-font); cursor: pointer; }
  .mode-btn.wide { grid-column: 1 / -1; }
  .mode-btn.on { border-color: var(--qx-accent); background: var(--qx-accent-soft); color: var(--qx-accent-text); }
  .cond-row { display: flex; gap: 5px; flex-wrap: wrap; margin: 2px 0 9px; }
  .cond-row span { border: 1px solid var(--qx-border); background: var(--qx-surface); color: var(--qx-text-faint); border-radius: 999px; padding: 4px 8px; font-size: 9px; font-weight: 850; }
  .cond-row span.on { color: var(--qx-green-text); border-color: var(--qx-green); background: var(--qx-green-soft); }
  .policy-q { font-size: 12px; font-weight: 850; color: var(--qx-text); margin: 4px 0 7px; }
  .policy-opts { display: grid; gap: 7px; margin-bottom: 9px; }
  .policy-opts button { min-height: 44px; border: 1.5px solid var(--qx-border-2); border-radius: 10px; background: var(--qx-surface); color: var(--qx-text-dim); font: 850 11.5px/1.2 var(--qx-font); padding: 8px; cursor: pointer; }
  .policy-opts button.correct { border-color: var(--qx-green); background: var(--qx-green-soft); color: var(--qx-green-text); }
  .policy-opts button.wrong { border-color: var(--qx-danger); background: var(--qx-danger-soft); color: var(--qx-danger-text); }

  .reveal { text-align: center; display: flex; flex-direction: column; align-items: center; }
  .reveal h2 { font-size: 20px; }
  .diagram { width: 100%; box-sizing: border-box; border: 1.5px solid var(--qx-border); border-radius: 12px; padding: 11px; background: var(--qx-surface-2); font-size: 10.5px; font-weight: 850; color: var(--qx-text-dim); line-height: 1.5; margin: 12px 0 10px; }
  .diagram b { color: var(--qx-accent-text); }
  .reveal-list { list-style: none; text-align: left; width: 100%; margin: 0 0 10px; padding: 0; display: grid; gap: 5px; }
  .reveal-list li { border: 1px solid var(--qx-border); border-radius: 9px; padding: 8px 11px; background: var(--qx-surface-2); font-size: 11px; line-height: 1.4; color: var(--qx-text-dim); }
  .reveal-list strong { color: var(--qx-text); font-weight: 950; }
  .misconceptions { width: 100%; display: grid; gap: 5px; margin-bottom: 12px; }
  .misconceptions span { text-align: left; border-left: 3px solid var(--qx-accent); background: var(--qx-accent-soft); border-radius: 0 8px 8px 0; padding: 7px 10px; font-size: 10.5px; line-height: 1.4; color: var(--qx-accent-text); }

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
    .phase { min-height: 400px; }
    h2 { font-size: 20px; }
    .tile-tray { gap: 4px; }
  }
</style>
