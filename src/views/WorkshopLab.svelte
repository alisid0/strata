<script>
  import Workshop from '../lib/components/assessments/Workshop.svelte';
  import {
    getChemistryCoreWorkshop,
    getChemistryStructureWorkshop,
    getComputerWorkshopModule,
    getComputerWorkshopModules,
    getLineCoreWorkshop,
    getMathsExpLogsWorkshop,
    getMathsMatricesWorkshop,
    getPhysicsElectricityWorkshop,
    getPhysicsWorkshopModule,
    getPhysicsWorkshopModules
  } from '../lib/content/workshops.js';

  export let onNavigate;

  let runId = 0;
  let finished = false;
  let score = 0;
  let total = 0;
  let activeTrack = 'computer';
  let activeModuleBySubject = {
    mathematics: 'line-core',
    computer: 'binary-data',
    chemistry: 'chemistry-core',
    physics: 'units-dimensions'
  };

  const COMPUTER_MODULES = getComputerWorkshopModules();
  const PHYSICS_MODULES = getPhysicsWorkshopModules();

  const TRACKS = {
    mathematics: {
      label: 'Mathematics',
      title: 'Mathematics workshops',
      sub: 'Number lines, exponents, logarithms, matrices, and visual problem solving.',
      icon: '/icons/gateways/line.png',
      pathId: 'LINE_001',
      modules: [
        {
          id: 'line-core',
          label: 'The Line',
          title: 'Plot, build, and measure',
          sub: 'Drag real points and lines on a live coordinate plane.',
          pathId: 'LINE_001',
          getWorkshop: getLineCoreWorkshop
        },
        {
          id: 'exp-logs',
          label: 'Exponents',
          title: 'Exponents and logarithms',
          sub: 'Read powers, growth, decay, logs, and inverse relationships.',
          pathId: 'MATH_EXP_LOGS',
          getWorkshop: getMathsExpLogsWorkshop
        },
        {
          id: 'matrices',
          label: 'Matrices',
          title: 'Spreadsheet to space machine',
          sub: 'Read cells, store data, and transform points.',
          pathId: 'MATH_MATRICES',
          getWorkshop: getMathsMatricesWorkshop
        }
      ]
    },
    computer: {
      label: 'Computer Science',
      title: 'Computer workshops',
      sub: 'Binary, logic, code, hardware, networks, security, and architecture.',
      icon: '/icons/gateways/bit.png',
      pathId: 'BIT_001',
      modules: COMPUTER_MODULES.map((module) => ({
        ...module,
        pathId: 'BIT_001',
        getWorkshop: () => getComputerWorkshopModule(module.id).interactions
      }))
    },
    chemistry: {
      label: 'Chemistry',
      title: 'Chemistry workshops',
      sub: 'Atoms, ions, molecules, bonding, structure, and reactions.',
      icon: '/icons/gateways/atom.png',
      pathId: 'ATOM_001',
      modules: [
        {
          id: 'chemistry-core',
          label: 'Atoms',
          title: 'Atom and molecule builder',
          sub: 'Build atoms, ions, isotopes, water, and carbon dioxide.',
          pathId: 'ATOM_001',
          getWorkshop: getChemistryCoreWorkshop
        },
        {
          id: 'chemistry-structure',
          label: 'Structure',
          title: 'Chemical structure and reactions',
          sub: 'Build ions, sort bonding, read molecular shape, and balance reaction logic.',
          pathId: 'CHEM_STRUCTURE_REACTIONS',
          getWorkshop: getChemistryStructureWorkshop
        }
      ]
    },
    physics: {
      label: 'Physics',
      title: 'Physics workshops',
      sub: 'Units, dimensions, forces, waves, electricity, and energy.',
      icon: '/icons/gateways/unit.png',
      pathId: 'PHYS_001',
      modules: [
        ...PHYSICS_MODULES.map((module) => ({
          ...module,
          pathId: 'PHYS_001',
          getWorkshop: () => getPhysicsWorkshopModule(module.id).interactions
        })),
        {
          id: 'electricity',
          label: 'Electricity',
          title: 'Electricity and circuits',
          sub: 'Sort charge, current, voltage, series, parallel, power, and circuit rules.',
          pathId: 'PHY_ELECTRICITY',
          getWorkshop: getPhysicsElectricityWorkshop
        }
      ]
    }
  };

  $: track = TRACKS[activeTrack];
  $: moduleTabs = track.modules || [];
  $: activeModuleId = activeModuleBySubject[activeTrack] || moduleTabs[0]?.id;
  $: activeModule = moduleTabs.find((item) => item.id === activeModuleId) || moduleTabs[0];
  $: workshopTitle = activeModule?.title || track.title;
  $: workshopSub = activeModule?.sub || track.sub;
  $: activePathId = activeModule?.pathId || track.pathId;
  $: interactions = activeModule?.getWorkshop ? activeModule.getWorkshop() : [];
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

  function chooseModule(id) {
    if (activeModuleBySubject[activeTrack] === id) return;
    activeModuleBySubject = { ...activeModuleBySubject, [activeTrack]: id };
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

  <div class="track-rail">
    <div class="track-rail-title">Subjects</div>
    <div class="track-tabs" role="tablist" aria-label="Workshop subjects">
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
  </div>

  <section class="spotlight">
    <div class="spotlight-copy">
      <span>{track.label}</span>
      <strong>{workshopTitle}</strong>
      <small>{workshopSub}</small>
    </div>
    <button on:click={() => onNavigate?.('topicDetail', activePathId)}>Open path</button>
  </section>

  {#if moduleTabs.length}
    <div class="module-tabs" role="tablist" aria-label={`${track.label} workshops`}>
      {#each moduleTabs as item}
        <button
          class:active={activeModuleId === item.id}
          on:click={() => chooseModule(item.id)}
          role="tab"
          aria-selected={activeModuleId === item.id}
        >
          {item.label}
        </button>
      {/each}
    </div>
  {/if}

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
    padding: 14px 14px 24px;
    box-sizing: border-box;
  }

  .lab-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 12px;
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
    font-size: 23px;
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
    width: 46px;
    height: 46px;
    object-fit: contain;
    flex-shrink: 0;
  }

  .track-rail {
    position: relative;
    margin: 0 -14px 12px;
    padding: 0 14px;
  }

  .track-rail::after {
    content: '';
    position: absolute;
    top: 18px;
    right: 0;
    bottom: 0;
    width: 34px;
    pointer-events: none;
    background: linear-gradient(90deg, transparent, var(--qx-bg));
  }

  .track-rail-title {
    color: var(--qx-text-faint);
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin: 0 0 7px;
  }

  .track-tabs {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x proximity;
    padding: 0 28px 2px 0;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .track-tabs::-webkit-scrollbar {
    display: none;
  }

  .track-tabs button {
    width: 156px;
    min-height: 44px;
    border-radius: 999px;
    border: 1.5px solid var(--qx-border);
    background: var(--qx-surface);
    color: var(--qx-text-dim);
    font-family: var(--qx-font);
    font-size: 13px;
    font-weight: 850;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 7px;
    padding: 0 10px;
    flex: 0 0 auto;
    scroll-snap-align: start;
  }

  .track-tabs span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .track-tabs button.active {
    border-color: var(--qx-accent);
    background: var(--qx-accent-soft);
    color: var(--qx-accent-text);
  }

  .track-tabs img {
    width: 20px;
    height: 20px;
    object-fit: contain;
    flex: 0 0 auto;
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
    margin-bottom: 12px;
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

  .module-tabs {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x proximity;
    padding: 0 0 10px;
    margin: -2px 0 4px;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .module-tabs::-webkit-scrollbar {
    display: none;
  }

  .module-tabs button {
    border: 1.5px solid var(--qx-border);
    border-radius: 999px;
    background: var(--qx-surface);
    color: var(--qx-text-dim);
    font-family: var(--qx-font);
    font-size: 12px;
    font-weight: 850;
    cursor: pointer;
    min-height: 34px;
    padding: 0 13px;
    white-space: nowrap;
    flex: 0 0 auto;
    scroll-snap-align: start;
  }

  .module-tabs button.active {
    border-color: var(--qx-accent);
    background: var(--qx-accent-soft);
    color: var(--qx-accent-text);
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
    .spotlight {
      align-items: flex-start;
      flex-direction: column;
    }

    .spotlight button {
      width: 100%;
    }
  }
</style>
