<script>
  import { onMount } from 'svelte';
  import SolveFirstPause from './SolveFirstPause.svelte';

  export let config;
  export let onDone = () => {};
  export let onExit = () => {};

  const COLS = 6;
  const ROWS = 3;
  const CELL_COUNT = COLS * ROWS;
  const RELEASE_IDS = ['B', 'D', 'F'];
  const ALLOCATE_QUEUE = [
    { id: 'A', size: 3, process: 'NAV' },
    { id: 'B', size: 2, process: 'COMMS' },
    { id: 'C', size: 3, process: 'MAP' },
    { id: 'D', size: 2, process: 'AUDIO' },
    { id: 'E', size: 3, process: 'NAV' },
    { id: 'F', size: 2, process: 'COMMS' }
  ];
  const FRAGMENTED = [
    { id: 'A', size: 2, start: 0, process: 'NAV' },
    { id: 'C', size: 2, start: 3, process: 'MAP' },
    { id: 'E', size: 2, start: 6, process: 'NAV' },
    { id: 'G', size: 2, start: 9, process: 'SENSOR' },
    { id: 'H', size: 2, start: 12, process: 'DISPLAY' }
  ];
  const LEAK_LAYOUT = [
    { id: 'A', size: 2, start: 0, process: 'NAV' },
    { id: 'L', size: 2, start: 3, process: 'MAP', leaked: true },
    { id: 'M', size: 2, start: 6, process: 'MAP' },
    { id: 'G', size: 2, start: 9, process: 'SENSOR' },
    { id: 'H', size: 2, start: 12, process: 'DISPLAY' }
  ];
  const PAGED_LAYOUT = [
    { id: 'A', size: 2, start: 0, process: 'NAV' },
    { id: 'B', size: 2, start: 3, process: 'COMMS' },
    { id: 'C', size: 2, start: 6, process: 'SENSOR' },
    { id: 'D', size: 2, start: 9, process: 'DISPLAY' },
    { id: 'E', size: 2, start: 12, process: 'AUDIO' }
  ];

  const STAGES = ['allocate', 'free', 'fragment', 'leak', 'compact', 'page', 'transfer', 'reveal'];
  const STAGE_LABELS = {
    allocate: 'Place',
    free: 'Clear',
    fragment: 'Fit',
    leak: 'Fault',
    compact: 'Move',
    page: 'Slice',
    transfer: 'Run',
    reveal: 'Reveal'
  };

  let phase = 'intro';
  let allocations = [];
  let incoming = [];
  let carrying = null;
  let forklift = { row: 0, col: -1 };
  let message = '';
  let messageTone = 'neutral';
  let allocateComplete = false;
  let fragmentFailed = false;
  let leakAttempted = false;
  let leakCleared = false;
  let compactMoves = 0;
  let compactComplete = false;
  let pageComplete = false;
  let transferComplete = false;
  let revealBeat = 0;
  let usedHint = false;
  let showHint = false;
  let placementFailures = 0;
  let transferFailures = 0;
  let recorded = false;

  $: occupied = buildOccupied(allocations);
  $: cells = Array.from({ length: CELL_COUNT }, (_, index) => occupied.get(index) || null);
  $: currentRequest = incoming[0] || null;
  $: usedCells = occupied.size;
  $: freeCells = CELL_COUNT - usedCells;
  $: largestGap = getLargestGap(allocations);
  $: pageRows = allocations
    .filter((item) => item.parent)
    .sort((a, b) => a.page - b.page)
    .map((item) => ({ page: item.page, frame: item.start }));
  $: releaseRemaining = RELEASE_IDS.filter((id) => allocations.some((item) => item.id === id)).length;
  $: stageIndex = Math.max(0, STAGES.indexOf(phase));
  $: reward = Math.min(15, 10 + (usedHint ? 0 : 2) + (transferFailures ? 1 : 3));

  function buildOccupied(items, ignoreId = null) {
    const map = new Map();
    for (const item of items) {
      if (ignoreId && item.id === ignoreId) continue;
      for (let offset = 0; offset < item.size; offset += 1) map.set(item.start + offset, item);
    }
    return map;
  }

  function getLargestGap(items) {
    const map = buildOccupied(items);
    let largest = 0;
    for (let row = 0; row < ROWS; row += 1) {
      let run = 0;
      for (let col = 0; col < COLS; col += 1) {
        if (map.has(row * COLS + col)) run = 0;
        else {
          run += 1;
          largest = Math.max(largest, run);
        }
      }
    }
    return largest;
  }

  function atIndex() {
    return forklift.col < 0 ? -1 : forklift.row * COLS + forklift.col;
  }

  function allocationAt(index) {
    return occupied.get(index) || null;
  }

  function canPlace(item, start) {
    if (!item || start < 0 || start >= CELL_COUNT) return false;
    const col = start % COLS;
    if (col + item.size > COLS) return false;
    for (let offset = 0; offset < item.size; offset += 1) {
      if (occupied.has(start + offset)) return false;
    }
    return true;
  }

  function setFeedback(text, tone = 'neutral') {
    message = text;
    messageTone = tone;
  }

  function resetForklift() {
    forklift = { row: 0, col: -1 };
    carrying = null;
  }

  function begin() {
    phase = 'allocate';
    allocations = [];
    incoming = ALLOCATE_QUEUE.map((item) => ({ ...item }));
    resetForklift();
    setFeedback('Tap the conveyor to collect a package, then tap the floor space where it should live.');
  }

  function move(direction) {
    if (phase === 'intro' || phase === 'reveal') return;
    let { row, col } = forklift;
    if (direction === 'left') {
      if (col > 0) col -= 1;
      else if (col === 0 && row === 0) col = -1;
    } else if (direction === 'right') {
      if (col === -1) col = 0;
      else if (col < COLS - 1) col += 1;
    } else if (direction === 'up' && col >= 0) row = Math.max(0, row - 1);
    else if (direction === 'down' && col >= 0) row = Math.min(ROWS - 1, row + 1);
    forklift = { row, col };
  }

  function interact() {
    if (!STAGES.includes(phase) || phase === 'reveal') return;
    const index = atIndex();

    if (index === -1) {
      if (carrying) {
        incoming = [carrying, ...incoming];
        setFeedback(`${carrying.id} returned to the conveyor.`, 'neutral');
        carrying = null;
      } else if (currentRequest) {
        carrying = currentRequest;
        incoming = incoming.slice(1);
        setFeedback(`${carrying.id} collected: ${carrying.size} cell${carrying.size === 1 ? '' : 's'} wide.`, 'neutral');
      } else {
        setFeedback('The conveyor is empty.', 'neutral');
      }
      return;
    }

    if (carrying) {
      if (!canPlace(carrying, index)) {
        placementFailures += 1;
        if (phase === 'fragment') fragmentFailed = true;
        if (phase === 'transfer') transferFailures += 1;
        setFeedback(
          `${carrying.id} needs ${carrying.size} adjacent open cell${carrying.size === 1 ? '' : 's'} on one row.`,
          'bad'
        );
        return;
      }
      const placed = { ...carrying, start: index };
      allocations = [...allocations, placed];
      setFeedback(`${placed.id} placed at floor cell ${index + 1}.`, 'good');
      if (phase === 'compact' && placed.movedFrom !== undefined) compactMoves += 1;
      carrying = null;
      afterPlacement(placed);
      return;
    }

    const item = allocationAt(index);
    if (!item) {
      setFeedback('Open cell. Bring a package here to allocate it.', 'neutral');
      return;
    }
    if (item.leaked) {
      leakAttempted = true;
      setFeedback(`${item.id} is locked. Its release signal is gone, but the floor still marks it as occupied.`, 'bad');
      return;
    }
    if (item.released) {
      allocations = allocations.filter((entry) => entry.id !== item.id);
      setFeedback(`${item.id} cleared. ${item.size} cells are free again.`, 'good');
      return;
    }
    if (phase === 'compact') {
      allocations = allocations.filter((entry) => entry.id !== item.id);
      carrying = { ...item, movedFrom: item.start };
      setFeedback(`${item.id} lifted. The warehouse is paused while live data moves.`, 'neutral');
      return;
    }
    setFeedback(`${item.id} is still active. It cannot be cleared yet.`, 'bad');
  }

  function useConveyor() {
    forklift = { row: 0, col: -1 };
    interact();
  }

  function useFloorCell(index) {
    forklift = { row: Math.floor(index / COLS), col: index % COLS };
    interact();
  }

  function afterPlacement(item) {
    if (phase === 'allocate' && incoming.length === 0 && allocations.length === ALLOCATE_QUEUE.length) {
      allocateComplete = true;
    }
    if (phase === 'compact' && item.id === 'X') compactComplete = true;
    if (phase === 'page' && item.parent === 'P' && allocations.filter((entry) => entry.parent === 'P').length === 4) {
      pageComplete = true;
    }
    if (phase === 'transfer') {
      const camDone = allocations.some((entry) => entry.id === 'CAM');
      const mapPages = allocations.filter((entry) => entry.parent === 'MAP').length;
      if (camDone && mapPages === 4) transferComplete = true;
    }
  }

  function enterFree() {
    phase = 'free';
    allocateComplete = false;
    allocations = allocations.map((item) => RELEASE_IDS.includes(item.id) ? { ...item, released: true } : item);
    incoming = [];
    resetForklift();
    setFeedback('Three customers have finished. Find the pulsing packages and clear them.');
  }

  function enterFragment() {
    phase = 'fragment';
    allocations = FRAGMENTED.map((item) => ({ ...item }));
    incoming = [{ id: 'X', size: 5, process: 'SCAN' }];
    fragmentFailed = false;
    resetForklift();
    setFeedback('A five-cell scan job is waiting. The dashboard says eight cells are free.');
  }

  function enterLeak() {
    phase = 'leak';
    allocations = LEAK_LAYOUT.map((item) => ({ ...item }));
    incoming = [];
    leakAttempted = false;
    leakCleared = false;
    resetForklift();
    setFeedback('Package L has no release signal. Tap it and try to clear it.');
  }

  function killProcess() {
    allocations = allocations.filter((item) => item.process !== 'MAP');
    leakCleared = true;
    setFeedback('MAP process terminated. Its leaked package and its useful package were both reclaimed.', 'good');
  }

  function enterCompact() {
    phase = 'compact';
    allocations = FRAGMENTED.map((item) => ({ ...item }));
    incoming = [{ id: 'X', size: 5, process: 'SCAN' }];
    compactMoves = 0;
    compactComplete = false;
    resetForklift();
    setFeedback('Move live packages until one row has five adjacent open cells. Every move pauses the floor.');
  }

  function enterPage() {
    phase = 'page';
    allocations = PAGED_LAYOUT.map((item) => ({ ...item }));
    incoming = [{ id: 'P', size: 4, process: 'FORECAST' }];
    pageComplete = false;
    resetForklift();
    setFeedback('A four-cell forecast package has arrived. No row has four adjacent openings.');
  }

  function sliceCarried() {
    if (!carrying || carrying.size <= 1 || !['page', 'transfer'].includes(phase)) return;
    const parent = carrying.id;
    const pieces = Array.from({ length: carrying.size }, (_, page) => ({
      id: `${parent}${page}`,
      parent,
      page,
      size: 1,
      process: carrying.process
    }));
    carrying = pieces[0];
    incoming = [...pieces.slice(1), ...incoming];
    setFeedback(`${parent} split into ${pieces.length} tracked pieces. The clipboard will remember every location.`, 'good');
  }

  function enterTransfer() {
    phase = 'transfer';
    allocations = PAGED_LAYOUT.map((item) => ({ ...item }));
    incoming = [
      { id: 'CAM', size: 3, process: 'CAMERA' },
      { id: 'MAP', size: 4, process: 'MAP' }
    ];
    transferComplete = false;
    transferFailures = 0;
    resetForklift();
    setFeedback('Final shift: load both jobs. The camera strip must remain whole. The map tiles may be tracked separately.');
  }

  function beginReveal() {
    phase = 'reveal';
    revealBeat = 0;
    resetForklift();
  }

  function nextReveal() {
    if (revealBeat < 4) {
      revealBeat += 1;
      return;
    }
    if (!recorded) {
      recorded = true;
      onDone({
        id: config.id,
        reward,
        evidenceCount: 4,
        patternFound: true,
        compared: true,
        transferred: true,
        transferFirstTry: transferFailures === 0,
        usedHint
      });
    }
    revealBeat = 5;
  }

  function useHint() {
    usedHint = true;
    showHint = true;
  }

  function formatAddress(index) {
    return `0x${index.toString(16).toUpperCase().padStart(2, '0')}`;
  }

  function keydown(event) {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target?.tagName)) return;
    const key = event.key.toLowerCase();
    const directions = {
      arrowleft: 'left', a: 'left',
      arrowright: 'right', d: 'right',
      arrowup: 'up', w: 'up',
      arrowdown: 'down', s: 'down'
    };
    if (directions[key]) {
      event.preventDefault();
      move(directions[key]);
    } else if (key === ' ' || key === 'enter') {
      event.preventDefault();
      interact();
    }
  }

  onMount(() => {
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  });
</script>

<div class="memory-game" class:technical={phase === 'reveal' && revealBeat >= 1}>
  {#if phase === 'intro'}
    <button class="exit" type="button" on:click={onExit} aria-label="Return to all workshops">←</button>
    <section class="intro">
      <span class="eyebrow">{config.eyebrow}</span>
      <div class="robot-mark" aria-hidden="true"><i></i><b>R.A.M.</b></div>
      <h2>RAM Page: Warehouse Worker</h2>
      <p>The launch warehouse receives packages that must stay on its limited floor while customers use them.</p>
      <strong>Place packages, clear finished work, and keep the launch computer running. No timer. Failed experiments are evidence.</strong>
      <button class="primary" type="button" on:click={begin}>Start the first shift</button>
    </section>

  {:else if phase === 'reveal'}
    <section class="reveal">
      <span class="eyebrow">Concept uncovered · {revealBeat + 1}/5</span>

      {#if revealBeat === 0}
        <h2>You were managing a computer’s working memory.</h2>
        <p>The final warehouse is frozen exactly where you left it. Nothing new is replacing the experience; the system you operated is about to change names.</p>
        <div class="frozen-label">Same positions · technical labels arriving</div>
      {:else if revealBeat === 1}
        <h2>The warehouse was RAM.</h2>
        <div class="translation-grid">
          <span><b>Floor</b>RAM</span>
          <span><b>Grid cell</b>Memory address</span>
          <span><b>Package</b>Allocated block</span>
          <span><b>Conveyor</b>Allocation request queue</span>
          <span><b>Forklift</b>Memory manager</span>
          <span><b>Clear signal</b>Deallocation request</span>
        </div>
      {:else if revealBeat === 2}
        <h2>Enough free memory can still be unusable.</h2>
        <div class="metric-replay">
          <span><b>8</b> cells free in total</span>
          <span><b>4</b> largest continuous opening</span>
          <span><b>5</b> cells requested together</span>
        </div>
        <p>The request failed because the free cells were split into smaller gaps. That is <strong>external fragmentation</strong>.</p>
      {:else if revealBeat === 3}
        <h2>Compaction recovered space—but moving live data cost work.</h2>
        <div class="copy-counter">
          <b>{compactMoves}</b>
          <span>live block move{compactMoves === 1 ? '' : 's'} during your recovery</span>
        </div>
        <p><strong>Compaction</strong> combines gaps by copying allocated blocks elsewhere. The floor pauses because addresses and data must be updated safely.</p>
      {:else}
        <h2>Paging removed the need for one physical block.</h2>
        <div class="page-table reveal-table">
          <div><b>Virtual page</b><b>Physical frame</b></div>
          {#each pageRows.slice(-4) as row}
            <div><span>MAP P{row.page}</span><span>Frame {row.frame}</span></div>
          {/each}
        </div>
        <p>The slicer created fixed-size <strong>pages</strong>. Each occupied a separate physical <strong>frame</strong>, and the <strong>page table</strong> preserved their logical order.</p>
        <div class="comparison">
          <article><b>Contiguous allocation</b><span>Simple, one block, adjacent space required.</span></article>
          <article><b>Paging</b><span>Separate frames, page table required, no external fragmentation.</span></article>
        </div>
      {/if}

      <div class="warehouse reveal-floor" aria-label="Final memory floor">
        <div class="dock"><span>{revealBeat >= 1 ? 'Request queue' : 'Belt'}</span></div>
        <div class="floor">
          {#each Array(CELL_COUNT) as _, index}
            <div class="cell" class:occupied={!!cells[index]} class:page={!!cells[index]?.parent}>
              <small>{revealBeat >= 1 ? formatAddress(index) : index + 1}</small>
              <b>{cells[index]?.parent ? `${cells[index].parent} P${cells[index].page}` : cells[index]?.id || ''}</b>
            </div>
          {/each}
        </div>
      </div>

      {#if revealBeat < 4}
        <button class="primary" type="button" on:click={nextReveal}>
          {revealBeat === 0 ? 'Translate the warehouse' : revealBeat === 1 ? 'Replay the failed request' : revealBeat === 2 ? 'Name the moving cost' : 'Reveal the slicer'}
        </button>
      {:else if revealBeat === 4}
        <div class="reward-panel">
          <div><span>Discovery distinction</span><strong>{config.rewardLabel}</strong></div>
          <b>+{reward} W</b>
        </div>
        <button class="primary" type="button" on:click={nextReveal}>Complete discovery</button>
      {:else}
        <div class="complete-panel"><b>Memory allocation mapped.</b><span>Your warehouse decisions now have their computer-science names.</span></div>
        <button class="primary" type="button" on:click={onExit}>Return to workshops</button>
      {/if}
    </section>

  {:else}
    <button class="exit" type="button" on:click={onExit} aria-label="Return to all workshops">←</button>
    <header>
      <span class="eyebrow">{config.eyebrow} · Warehouse shift</span>
      <h2>RAM Page</h2>
    </header>

    <div class="rail" aria-label="Discovery progress">
      {#each STAGES as stage}
        <span class:current={stage === phase} class:done={stageIndex > STAGES.indexOf(stage)}>{STAGE_LABELS[stage]}</span>
      {/each}
    </div>

    <section class="mission">
      {#if phase === 'allocate'}
        <span>Shift 1 · Intake</span><h3>Give every package a home.</h3>
        <p>Packages must lie horizontally in one unbroken row. Where they go is your decision.</p>
      {:else if phase === 'free'}
        <span>Shift 2 · Release</span><h3>Clear only finished packages.</h3>
        <p>A pulsing package is no longer needed. Active packages must remain untouched.</p>
      {:else if phase === 'fragment'}
        <span>Shift 3 · Pressure</span><h3>Load the five-cell scan job.</h3>
        <p>The dashboard reports enough total room. Test whether the floor can accept it.</p>
      {:else if phase === 'leak'}
        <span>Shift 4 · Fault</span><h3>Investigate package L.</h3>
        <p>Its customer has gone, but no release signal arrived.</p>
      {:else if phase === 'compact'}
        <span>Shift 5 · Recovery</span><h3>Build one five-cell opening.</h3>
        <p>Lift active packages and relocate them. The floor pauses for every move.</p>
      {:else if phase === 'page'}
        <span>Shift 6 · Upgrade</span><h3>Use the new pallet slicer.</h3>
        <p>Split the waiting package, scatter its pieces, and watch the clipboard track them.</p>
      {:else}
        <span>Final shift · No instructions</span><h3>Load the camera and map jobs.</h3>
        <p>The camera strip must remain whole. The map tiles may live separately.</p>
      {/if}
    </section>

    <div class="dashboard">
      <span><small>Used</small><b>{usedCells}/{CELL_COUNT}</b></span>
      <span><small>Free</small><b>{freeCells}</b></span>
      <span><small>Largest opening</small><b>{largestGap}</b></span>
      <span><small>Moves</small><b>{compactMoves}</b></span>
    </div>

    <div class="warehouse">
      <button
        class="dock"
        class:forklift={forklift.col === -1}
        type="button"
        aria-label="Conveyor gate"
        on:click={useConveyor}
      >
        <span class="belt-label">Incoming conveyor</span>
        <span class="belt" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>
        {#if currentRequest}
          <span class="incoming-crate" style={`--crate-size:${currentRequest.size}`}>
            <b>{currentRequest.id}</b><small>{currentRequest.size} cells</small>
          </span>
        {:else}
          <small class="belt-empty">No package waiting</small>
        {/if}
        {#if forklift.col === -1}
          <span class="forklift-sprite docked" aria-hidden="true"><i></i><b></b><em></em></span>
        {/if}
      </button>

      <div class="floor-wrap">
        <div class="floor" aria-label="Warehouse floor">
          {#each Array(CELL_COUNT) as _, index}
            {@const row = Math.floor(index / COLS)}
            {@const col = index % COLS}
            <button
              type="button"
              class="cell"
              class:occupied={!!cells[index]}
              class:forklift={forklift.row === row && forklift.col === col}
              aria-label={cells[index]
                ? `Floor cell ${index + 1}, package ${cells[index].id}${cells[index].leaked ? ', locked package' : cells[index].released ? ', ready to clear' : ''}`
                : `Floor cell ${index + 1}, open`}
              on:click={() => useFloorCell(index)}
            >
              <small>{index + 1}</small>
            </button>
          {/each}
        </div>

        <div class="crate-layer" aria-hidden="true">
          {#each allocations as item (item.id)}
            <div
              class="crate"
              class:released={item.released}
              class:leaked={item.leaked}
              class:page={item.parent}
              style={`grid-column:${item.start % COLS + 1} / span ${item.size};grid-row:${Math.floor(item.start / COLS) + 1};`}
            >
              <b>{item.parent ? `${item.parent}${item.page}` : item.id}</b>
              {#if item.released}<span>COLLECT</span>{/if}
              {#if item.leaked}<span>LOCKED</span>{/if}
            </div>
          {/each}
          {#if forklift.col >= 0}
            <span
              class="forklift-sprite"
              style={`grid-column:${forklift.col + 1};grid-row:${forklift.row + 1};`}
            ><i></i><b></b><em></em></span>
          {/if}
        </div>
      </div>
    </div>

    <div class="load-status">
      <span>Forklift</span>
      {#if carrying}
        <b>Carrying {carrying.id}</b><small>{carrying.size} cell{carrying.size === 1 ? '' : 's'} wide</small>
      {:else}
        <b>Empty</b><small>Tap the conveyor or a package</small>
      {/if}
    </div>

    {#if pageRows.length && ['page', 'transfer'].includes(phase)}
      <aside class="clipboard">
        <div><span>Manager’s clipboard</span><b>Piece → floor cell</b></div>
        {#each pageRows as row}<small>P{row.page} → {row.frame + 1}</small>{/each}
      </aside>
    {/if}

    {#if carrying?.size > 1 && ['page', 'transfer'].includes(phase)}
      <button class="wall-tool slicer" type="button" on:click={sliceCarried}>
        <b>PALLET SLICER</b><span>Split {carrying.id} into {carrying.size} tracked pieces</span>
      </button>
    {/if}

    {#if phase === 'leak' && leakAttempted && !leakCleared}
      <button class="wall-tool kill" type="button" on:click={killProcess}>
        <b>PROCESS KILL · MAP</b><span>Force-stop the owner and reclaim its whole section</span>
      </button>
    {/if}

    <div class="feedback" class:good={messageTone === 'good'} class:bad={messageTone === 'bad'} aria-live="polite">{message}</div>

    {#if allocateComplete}
      <SolveFirstPause title="Every package now owns floor space." message="The positions matter because each package occupies real, limited cells." actionLabel="Release finished work" onContinue={enterFree} />
    {:else if phase === 'free' && releaseRemaining === 0}
      <SolveFirstPause title="Clearing made those cells reusable." message="The other packages remained protected because their customers were still using them." actionLabel="Begin the next shift" onContinue={enterFragment} />
    {:else if phase === 'fragment' && fragmentFailed}
      <SolveFirstPause title="Eight free cells. No five-cell opening." message="The total is large enough, but the gaps are the wrong shape. Keep this failed arrangement as evidence." actionLabel="Investigate another fault" onContinue={enterLeak} />
    {:else if phase === 'leak' && leakCleared}
      <SolveFirstPause title="The locked package is gone—but useful MAP work vanished too." message="Stopping the owner reclaimed everything it held. The forgotten allocation could not be cleared on its own." actionLabel="Recover the scattered floor" onContinue={enterCompact} />
    {:else if phase === 'compact' && compactComplete}
      <SolveFirstPause title={`The large job fits after ${compactMoves} live moves.`} message="No capacity was added. You paid for a wider opening by relocating active packages while the floor paused." actionLabel="Install the warehouse upgrade" onContinue={enterPage} />
    {:else if phase === 'page' && pageComplete}
      <SolveFirstPause title="One package now lives in four separate places." message="The clipboard preserves the piece order, so physical adjacency is no longer required." actionLabel="Run the final shift" onContinue={enterTransfer} />
    {:else if phase === 'transfer' && transferComplete}
      <SolveFirstPause title="Both workloads are live." message="You kept the camera contiguous and used tracked pieces for the map. The warehouse can now reveal its real identity." actionLabel="Reveal the computer system" onContinue={beginReveal} />
    {:else if phase === 'compact' && !showHint}
      <button class="hint-button" type="button" on:click={useHint}>Need a nudge?</button>
    {:else if phase === 'compact' && showHint}
      <p class="hint">Try filling the first row from the left, then the second. An empty third row gives the five-cell job room.</p>
    {/if}
  {/if}
</div>

<style>
  .memory-game { width: 100%; max-width: 720px; margin: 0 auto; position: relative; color: var(--qx-text); font-family: var(--qx-font); }
  button { font: inherit; }
  button:focus-visible { outline: 3px solid var(--qx-accent); outline-offset: 2px; }
  .exit { position: absolute; top: 0; left: 0; z-index: 5; width: 44px; height: 44px; border: 1.5px solid var(--qx-border); border-radius: 50%; background: var(--qx-surface); color: var(--qx-text); cursor: pointer; font-size: 20px; }
  header { min-height: 46px; padding: 1px 54px 8px; text-align: center; }
  h2, h3, p { margin-top: 0; }
  header h2 { margin-bottom: 0; font-size: 22px; font-weight: 950; }
  .eyebrow, .mission > span { color: var(--qx-accent-text); font-size: 9px; font-weight: 950; letter-spacing: .12em; text-transform: uppercase; }
  .intro, .reveal { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 8px 2px; text-align: center; }
  .intro h2, .reveal h2 { max-width: 22ch; margin: 0; font-size: clamp(24px, 5vw, 34px); font-weight: 950; line-height: 1.08; }
  .intro p, .intro > strong, .reveal > p { max-width: 52ch; margin: 0; color: var(--qx-text-dim); font-size: 14px; line-height: 1.55; }
  .intro > strong, .reveal strong { color: var(--qx-text); }
  .robot-mark { width: 94px; height: 82px; display: grid; place-items: center; border: 2px solid var(--qx-text); border-radius: 8px; background: var(--qx-surface-2); box-shadow: 6px 6px 0 var(--qx-border-2); }
  .robot-mark i { width: 44px; height: 24px; border: 2px solid var(--qx-text); background: repeating-linear-gradient(90deg, var(--qx-accent) 0 7px, var(--qx-surface) 7px 14px); }
  .robot-mark b { font-size: 11px; letter-spacing: .13em; }
  .translation-grid { display: flex; justify-content: center; gap: 7px; flex-wrap: wrap; }
  .frozen-label { padding: 6px 10px; border: 1px solid var(--qx-border); border-radius: 999px; background: var(--qx-surface-2); color: var(--qx-text-dim); font-size: 10px; font-weight: 800; }
  .primary { width: 100%; min-height: 48px; border: 0; border-radius: 4px; background: var(--qx-accent); color: var(--qx-bg); cursor: pointer; font-size: 13px; font-weight: 950; }
  .rail { display: flex; justify-content: center; gap: 4px; margin-bottom: 10px; flex-wrap: wrap; }
  .rail span { padding: 4px 7px; border: 1px solid var(--qx-border); border-radius: 999px; background: var(--qx-surface-2); color: var(--qx-text-faint); font-size: 8px; font-weight: 900; text-transform: uppercase; }
  .rail span.current { border-color: var(--qx-accent); background: var(--qx-accent-soft); color: var(--qx-accent-text); }
  .rail span.done { border-color: var(--qx-green); background: var(--qx-green-soft); color: var(--qx-green-text); }
  .mission { padding: 10px 12px; border-left: 4px solid var(--qx-accent); background: var(--qx-surface-2); }
  .mission h3 { margin: 2px 0; font-size: 16px; font-weight: 950; }
  .mission p { margin: 0; color: var(--qx-text-dim); font-size: 12px; line-height: 1.4; }
  .dashboard { display: flex; justify-content: flex-end; gap: 5px; margin: 8px 0; flex-wrap: wrap; }
  .dashboard span { min-width: 76px; padding: 5px 8px; border: 1px solid var(--qx-border); border-radius: 999px; background: var(--qx-surface); text-align: center; }
  .dashboard small { display: block; color: var(--qx-text-faint); font-size: 8px; font-weight: 850; text-transform: uppercase; }
  .dashboard b { font-size: 13px; font-variant-numeric: tabular-nums; }
  .warehouse { position: relative; overflow: hidden; border: 2px solid var(--qx-text); border-radius: 8px; background: var(--qx-surface-3); box-shadow: 6px 6px 0 var(--qx-border-2); }
  .dock { position: relative; width: 100%; min-height: 82px; overflow: hidden; display: block; border: 0; border-bottom: 2px solid var(--qx-text); background: var(--qx-surface-2); color: var(--qx-text); cursor: pointer; text-align: left; }
  .belt-label { position: absolute; top: 7px; left: 12px; z-index: 3; color: var(--qx-text-dim); font-size: 8px; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
  .belt { position: absolute; inset: 28px 0 10px; display: grid; grid-template-columns: repeat(6, 1fr); gap: 5px; padding: 5px 10px; border-top: 2px solid var(--qx-border-2); border-bottom: 2px solid var(--qx-border-2); background: var(--qx-surface); }
  .belt i { display: block; border-radius: 999px; background: repeating-linear-gradient(90deg, var(--qx-border-2) 0 6px, var(--qx-surface-3) 6px 12px); }
  .incoming-crate { --crate-size: 1; position: absolute; z-index: 2; top: 31px; left: 48%; width: clamp(66px, calc(var(--crate-size) * 11%), 190px); height: 42px; display: flex; align-items: center; justify-content: center; gap: 9px; border: 2px solid var(--qx-accent); border-radius: 4px; background: var(--qx-accent); box-shadow: inset 0 0 0 3px var(--qx-accent-soft), 4px 4px 0 color-mix(in srgb, var(--qx-text) 24%, transparent); color: var(--qx-bg); transform: translateX(-50%); }
  .incoming-crate::before, .crate::before { content: ''; position: absolute; inset: 5px; border: 1px dashed color-mix(in srgb, currentColor 50%, transparent); pointer-events: none; }
  .incoming-crate b { font-size: 18px; }
  .incoming-crate small { font-size: 9px; font-weight: 800; }
  .belt-empty { position: absolute; z-index: 2; top: 45px; left: 50%; color: var(--qx-text-faint); font-size: 9px; font-weight: 800; transform: translateX(-50%); }
  .floor-wrap { position: relative; }
  .floor { display: grid; grid-template-columns: repeat(6, minmax(44px, 1fr)); grid-template-rows: repeat(3, 76px); gap: 4px; padding: 9px; background: repeating-linear-gradient(0deg, transparent 0 15px, color-mix(in srgb, var(--qx-text) 4%, transparent) 15px 16px), var(--qx-surface-3); }
  .cell { position: relative; z-index: 1; min-width: 44px; min-height: 64px; overflow: hidden; border: 1.5px dashed var(--qx-border-2); border-radius: 3px; background: color-mix(in srgb, var(--qx-surface) 82%, transparent); color: var(--qx-text-faint); cursor: pointer; }
  .cell:hover { border-color: var(--qx-accent); background: var(--qx-surface); }
  .cell small { position: absolute; top: 4px; left: 5px; font-size: 7px; font-weight: 900; }
  .cell.occupied { border-style: solid; border-color: color-mix(in srgb, var(--qx-accent) 42%, var(--qx-border)); background: var(--qx-accent-soft-2); }
  .cell.forklift { outline: 3px solid var(--qx-green); outline-offset: -4px; }
  .crate-layer { position: absolute; z-index: 2; inset: 9px; display: grid; grid-template-columns: repeat(6, minmax(44px, 1fr)); grid-template-rows: repeat(3, 76px); gap: 4px; pointer-events: none; }
  .crate { position: relative; align-self: center; height: 54px; display: flex; align-items: center; justify-content: center; border: 2px solid var(--qx-accent-text); border-radius: 4px; background: var(--qx-accent); box-shadow: inset 0 0 0 3px var(--qx-accent-soft), 3px 3px 0 color-mix(in srgb, var(--qx-text) 25%, transparent); color: var(--qx-bg); }
  .crate b { position: relative; z-index: 1; font-size: 17px; font-weight: 950; }
  .crate span { position: absolute; right: 7px; bottom: 5px; z-index: 1; font-size: 7px; font-weight: 950; letter-spacing: .08em; }
  .crate.released { border-color: var(--qx-green-text); background: var(--qx-green); animation: pulse 1.2s ease-in-out infinite; }
  .crate.leaked { border-color: var(--qx-danger-text); background: var(--qx-danger); }
  .crate.page { border-color: var(--qx-green-text); background: var(--qx-green); }
  .forklift-sprite { position: relative; z-index: 5; align-self: end; justify-self: center; width: 38px; height: 45px; display: block; filter: drop-shadow(2px 3px 0 color-mix(in srgb, var(--qx-text) 35%, transparent)); }
  .forklift-sprite::before { content: ''; position: absolute; left: 7px; bottom: 7px; width: 24px; height: 23px; border: 2px solid var(--qx-green-text); border-radius: 5px 5px 3px 3px; background: var(--qx-green); }
  .forklift-sprite::after { content: ''; position: absolute; left: 12px; top: 3px; width: 15px; height: 18px; border: 3px solid var(--qx-text); border-bottom: 0; border-radius: 3px 3px 0 0; }
  .forklift-sprite i, .forklift-sprite b { position: absolute; bottom: 2px; width: 8px; height: 8px; border: 2px solid var(--qx-text); border-radius: 50%; background: var(--qx-surface); }
  .forklift-sprite i { left: 5px; } .forklift-sprite b { right: 3px; }
  .forklift-sprite em { position: absolute; right: -5px; bottom: 5px; width: 15px; height: 3px; border-top: 3px solid var(--qx-text); border-right: 3px solid var(--qx-text); font-style: normal; }
  .forklift-sprite.docked { position: absolute; right: 15px; bottom: 12px; }
  .load-status { display: flex; gap: 8px; align-items: center; margin-top: 9px; padding: 7px 10px; border: 1px solid var(--qx-border); border-radius: 999px; background: var(--qx-surface-2); }
  .load-status > span { color: var(--qx-text-faint); font-size: 8px; font-weight: 900; text-transform: uppercase; }
  .load-status b { font-size: 12px; }
  .load-status small { margin-left: auto; color: var(--qx-text-dim); font-size: 9px; }
  .clipboard { display: flex; align-items: center; gap: 7px; margin-top: 8px; padding: 8px 10px; border: 2px solid var(--qx-green); background: var(--qx-green-soft); }
  .clipboard div { display: grid; margin-right: auto; text-align: left; }
  .clipboard span { color: var(--qx-green-text); font-size: 8px; font-weight: 900; text-transform: uppercase; }
  .clipboard b, .clipboard small { font-size: 10px; }
  .clipboard small { padding: 3px 6px; border: 1px solid var(--qx-green); background: var(--qx-surface); color: var(--qx-green-text); }
  .wall-tool { width: 100%; min-height: 50px; display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-top: 8px; padding: 8px 12px; border: 2px solid var(--qx-text); border-radius: 3px; background: var(--qx-surface); color: var(--qx-text); cursor: pointer; text-align: left; }
  .wall-tool b { font-size: 11px; }
  .wall-tool span { color: var(--qx-text-dim); font-size: 10px; }
  .wall-tool.slicer { border-color: var(--qx-green); }
  .wall-tool.kill { border-color: var(--qx-danger); background: var(--qx-danger-soft); }
  .feedback { min-height: 30px; margin-top: 8px; padding: 7px 10px; border-left: 4px solid var(--qx-border-2); background: var(--qx-surface-2); color: var(--qx-text-dim); font-size: 11px; font-weight: 700; line-height: 1.4; }
  .feedback.good { border-color: var(--qx-green); background: var(--qx-green-soft); color: var(--qx-green-text); }
  .feedback.bad { border-color: var(--qx-danger); background: var(--qx-danger-soft); color: var(--qx-danger-text); }
  .hint-button { display: block; min-height: 44px; margin: 8px auto 0; border: 0; background: transparent; color: var(--qx-accent-text); cursor: pointer; font-weight: 850; text-decoration: underline; }
  .hint { margin: 8px 0 0; padding: 9px; border: 1px solid var(--qx-accent); background: var(--qx-accent-soft); color: var(--qx-accent-text); font-size: 11px; text-align: center; }
  .translation-grid { width: 100%; display: grid; grid-template-columns: repeat(2, 1fr); }
  .translation-grid span { display: grid; padding: 9px; border: 1px solid var(--qx-border); background: var(--qx-surface); color: var(--qx-text-dim); font-size: 11px; text-align: left; }
  .translation-grid b { color: var(--qx-text); font-size: 9px; text-transform: uppercase; }
  .metric-replay, .comparison { width: 100%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
  .metric-replay span, .comparison article { display: grid; gap: 3px; padding: 10px; border: 1px solid var(--qx-border); background: var(--qx-surface); }
  .metric-replay b { color: var(--qx-accent-text); font-size: 23px; }
  .metric-replay span, .comparison span { color: var(--qx-text-dim); font-size: 10px; }
  .copy-counter { display: grid; padding: 12px 28px; border: 2px solid var(--qx-accent); background: var(--qx-accent-soft); }
  .copy-counter b { font-size: 32px; }
  .copy-counter span { color: var(--qx-text-dim); font-size: 10px; }
  .page-table { width: 100%; max-width: 390px; border: 1px solid var(--qx-border-2); background: var(--qx-surface); }
  .page-table > div { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid var(--qx-border); }
  .page-table span, .page-table b { padding: 7px; font-size: 11px; }
  .comparison { grid-template-columns: repeat(2, 1fr); }
  .comparison article { text-align: left; }
  .reward-panel, .complete-panel { width: 100%; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; border: 1.5px solid var(--qx-accent); background: var(--qx-accent-soft); text-align: left; }
  .reward-panel span { display: block; color: var(--qx-accent-text); font-size: 9px; font-weight: 900; text-transform: uppercase; }
  .reward-panel > b { color: var(--qx-accent-text); font-size: 19px; }
  .complete-panel { display: grid; border-color: var(--qx-green); background: var(--qx-green-soft); }
  .complete-panel span { color: var(--qx-green-text); font-size: 11px; }
  .reveal-floor { width: 100%; text-align: left; }
  .reveal-floor .dock { min-height: 48px; padding: 15px 12px 0; box-sizing: border-box; }
  .reveal-floor .floor { grid-template-rows: repeat(3, 54px); }
  .technical .cell small { color: var(--qx-text-faint); }
  @keyframes pulse { 50% { filter: brightness(1.1); box-shadow: inset 0 0 0 2px var(--qx-green); } }
  @media (max-width: 600px) {
    .dock { min-height: 76px; }
    .floor { grid-template-columns: repeat(6, minmax(44px, 1fr)); grid-template-rows: repeat(3, 62px); overflow-x: auto; }
    .crate-layer { grid-template-columns: repeat(6, minmax(44px, 1fr)); grid-template-rows: repeat(3, 62px); }
    .cell { min-height: 52px; }
    .crate { height: 44px; }
    .forklift-sprite { transform: scale(.86); }
    .clipboard { flex-wrap: wrap; }
    .reveal-floor .floor { grid-template-rows: repeat(3, 48px); }
  }
  @media (max-width: 390px) {
    .dashboard { justify-content: stretch; }
    .dashboard span { flex: 1 1 38%; }
    .floor { grid-template-columns: repeat(6, 44px); }
    .crate-layer { grid-template-columns: repeat(6, 44px); }
    .translation-grid, .comparison { grid-template-columns: 1fr; }
    .metric-replay { grid-template-columns: repeat(3, 1fr); }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }
</style>
