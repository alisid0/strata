<script context="module">
  // Module-level catalog: lets other views (PathView's "Learn it by doing"
  // section) look up workshops by pathId without mounting this component.
  import {
    getChemFoundryWorkshop,
    getChemistryCoreWorkshop,
    getChemistryStructureWorkshop,
    getMathCoordGeometryWorkshop,
    getMathCoordMapsWorkshop,
    getMathLinearGraphsWorkshop,
    getChemAtomicWorkshop,
    getChemNucleusWorkshop,
    getChemBondingWorkshop,
    getChemBondingTypesWorkshop,
    getChemArchWorkshop,
    getPhysMomentumWorkshop,
    getChemMoleWorkshop,
    getChemMoleCountingWorkshop,
    getChemBiomoleculesWorkshop,
    getPhysForcesWorkshop,
    getPhysSiScaleWorkshop,
    getPhysScaleWorkshop,
    getMathLimitsWorkshop,
    getPhysMeasurementLimitsWorkshop,
    getPhysFoundationsWorkshop,
    getCompAiEraWorkshop,
    getCompAiBehindWorkshop,
    getComputerWorkshopModule,
    getComputerWorkshopModules,
    getLineCoreWorkshop,
    getMathsFunctionsWorkshop,
    getMathsUnitCircleWorkshop,
    getPhysCircuitWorkshop,
    getPhysMotionWorkshop,
    getMathsExpLogsWorkshop,
    getMathsMatricesWorkshop,
    getPhysicsWorkshopModule,
    getPhysicsWorkshopModules
  } from '../lib/content/workshops.js';
  import {
    getChemistryQuantWorkshop,
    getMathsDifferentiationWorkshop,
    getPhysicsOpticsWorkshop
  } from '../lib/content/topicExpansionWorkshops.js';
  import { getSeriesIIModules } from '../lib/content/workshops2.js';

  const COMPUTER_MODULES = getComputerWorkshopModules();
  const PHYSICS_MODULES = getPhysicsWorkshopModules();
  const getBitMachineWorkshop = () => [{
    type: 'bitmachine',
    prompt: 'Use a tiny machine to build a number, handle a carry, and run instructions.'
  }];
  const getUnitForgeWorkshop = () => [{
    type: 'unitforge',
    prompt: 'Measure, convert, forge, and judge units before trusting a physics answer.'
  }];
  const getBondLabWorkshop = () => [{
    type: 'bondlab',
    prompt: 'Place atoms on the bench and form stable compounds by sharing or transferring electrons.'
  }];
  const getFunctionLabWorkshop = () => [{
    type: 'functionlab',
    prompt: 'One rule reshapes any function: y = a·f(x − c) + d. You just proved it on two shapes.'
  }];
  const getAsymptoteLabWorkshop = () => [{
    type: 'asymptotelab',
    prompt: 'A wall where the denominator hits zero; a floor where the curve fades out.'
  }];
  const getRateIntervalWorkshop = () => [{
    type: 'rateinterval',
    prompt: 'Average speed over an interval is the slope of the line joining its two ends.'
  }];
  const getLocalLinearityWorkshop = () => [{
    type: 'locallinearity',
    prompt: 'Up close, a smooth curve looks like a straight line; a corner never does.'
  }];
  const getSecantTangentWorkshop = () => [{
    type: 'secanttangent',
    prompt: 'A slope at a point is a secant squeezed until the gap vanishes — and those slopes make a new curve.'
  }];
  const getProbabilityWorkshop = () => [{
    type: 'probability',
    prompt: 'A few spins are wild, but over the long run the rate settles on favourable ÷ total.'
  }];
  const getEquationBalancerWorkshop = () => [{
    type: 'equationbalancer',
    prompt: 'Balance each equation: adjust the coefficients until every element matches on both sides.'
  }];
  const COMPUTER_MODULE_PATHS = {
    'binary-data': 'BIT_001',
    'logic-gates': 'BIT_001',
    'code-algorithms': 'COMP_CODE_COMMAND',
    'hardware-memory': 'COMP_HARDWARE',
    'networks-cloud': 'COMP_NETWORKS_SECURITY',
    'security-architecture': 'COMP_SYSTEM_DESIGN'
  };

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
          id: 'functions',
          label: 'Functions',
          title: 'Function machine',
          sub: 'Test input-output rules, notation, domains, graphs, inverses, and composites.',
          pathId: 'MATH_FUNCTIONS',
          getWorkshop: getMathsFunctionsWorkshop
        },
        {
          id: 'transformation-lab',
          label: 'Transforms',
          title: 'Transformation lab',
          sub: 'Drag a curve onto its target: translate, stretch, and flip any function.',
          pathId: 'MATH_FUNCTIONS',
          getWorkshop: getFunctionLabWorkshop
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
        },
        {
          id: 'trigonometry',
          label: 'Trig',
          title: 'Unit circle and wave lab',
          sub: 'Drag the angle, read cos and sin, and unwrap the sine wave.',
          pathId: 'MATH_TRIG_ADV',
          getWorkshop: getMathsUnitCircleWorkshop
        },
        {
          id: 'differentiation',
          label: 'Diff',
          title: 'Derivative control room',
          sub: 'Use slopes, rules, units, and rates without guesswork.',
          pathId: 'MATH_DIFF',
          getWorkshop: getMathsDifferentiationWorkshop
        },
        {
          id: 'rate-interval',
          label: 'Avg rate',
          title: 'Rate over an interval',
          sub: 'Drag an interval on a distance–time curve and read its average speed as a secant slope.',
          pathId: 'MATH_DIFF',
          getWorkshop: getRateIntervalWorkshop
        },
        {
          id: 'local-linearity',
          label: 'Zoom in',
          title: 'Local linearity',
          sub: 'Zoom into a curve until it straightens — or stays a sharp corner.',
          pathId: 'MATH_DIFF',
          getWorkshop: getLocalLinearityWorkshop
        },
        {
          id: 'secant-tangent',
          label: 'Tangent',
          title: 'Secant to tangent',
          sub: 'Squeeze a secant to h→0 to get the tangent slope, then paint the derivative graph.',
          pathId: 'MATH_DIFF',
          getWorkshop: getSecantTangentWorkshop
        },
        {
          id: 'probability',
          label: 'Chance',
          title: 'The long run',
          sub: 'Read the odds off a spinner, then spin it and watch the rate settle on the theory.',
          pathId: 'MATH_PROBABILITY',
          getWorkshop: getProbabilityWorkshop
        },
        {
          id: 'coord-geometry',
          label: 'Coordinates',
          title: 'Coordinate geometry',
          sub: 'Plot points, measure distance, find midpoints, and match lines.',
          pathId: 'MATH_COORD',
          getWorkshop: getMathCoordGeometryWorkshop
        },
        {
          id: 'coord-maps',
          label: 'Grid maps',
          title: 'Coordinate maps',
          sub: 'Read and write coordinates across all four quadrants.',
          pathId: 'MATH_COORD_MAPS',
          getWorkshop: getMathCoordMapsWorkshop
        },
        {
          id: 'linear-graphs',
          label: 'Gradients',
          title: 'Lines and gradients',
          sub: 'Build y = mx + c and feel how slope and intercept move a line.',
          pathId: 'MATH_LINEAR_GRAPHS',
          getWorkshop: getMathLinearGraphsWorkshop
        },
        {
          id: 'limits',
          label: 'Limits',
          title: 'Limits and continuity',
          sub: 'Reason about the value a function approaches, even where it breaks.',
          pathId: 'MATH_LIMITS',
          getWorkshop: getMathLimitsWorkshop
        },
        {
          id: 'asymptote-lab',
          label: 'Asymptotes',
          title: 'Asymptote lab',
          sub: 'Read where a curve blows up and where it levels off — place the walls and floors.',
          pathId: 'MATH_LIMITS',
          getWorkshop: getAsymptoteLabWorkshop
        },
        ...getSeriesIIModules('mathematics')
      ]
    },
    computer: {
      label: 'Computer Science',
      title: 'Computer workshops',
      sub: 'Practice the foundations first, then code, hardware, networks, systems, and AI.',
      icon: '/icons/gateways/bit.png',
      pathId: 'BIT_001',
      modules: [
        {
          id: 'bit-machine',
          label: 'Machine',
          title: 'Bit machine lab',
          sub: 'Build numbers, carry bits, and run tiny machine instructions.',
          pathId: 'BIT_001',
          getWorkshop: getBitMachineWorkshop
        },
        ...COMPUTER_MODULES.map((module) => ({
          ...module,
          pathId: COMPUTER_MODULE_PATHS[module.id] || 'BIT_001',
          getWorkshop: () => getComputerWorkshopModule(module.id).interactions
        })),
        {
          id: 'ai-era',
          label: 'AI era',
          title: 'AI-era computing',
          sub: 'Sort rule-writing from machine learning, and see what changed.',
          pathId: 'COMP_AI_ERA',
          getWorkshop: getCompAiEraWorkshop
        },
        {
          id: 'ai-behind',
          label: 'AI inside',
          title: 'AI behind the curtain',
          sub: 'Tokens, weights, training vs use, and why models hallucinate.',
          pathId: 'COMP_AI_BEHIND',
          getWorkshop: getCompAiBehindWorkshop
        },
        ...getSeriesIIModules('computer')
      ]
    },
    chemistry: {
      label: 'Chemistry',
      title: 'Chemistry workshops',
      sub: 'Atoms, ions, molecules, bonding, structure, and reactions.',
      icon: '/icons/gateways/atom.png',
      pathId: 'ATOM_001',
      modules: [
        {
          id: 'atom-foundry',
          label: 'Foundry',
          title: 'Atom Foundry',
          sub: 'Forge a nucleus, fill the shells, and strip electrons into ions.',
          pathId: 'ATOM_001',
          getWorkshop: getChemFoundryWorkshop
        },
        {
          id: 'bond-lab',
          label: 'Bond lab',
          title: 'Bond bench',
          sub: 'Place atoms on the bench and form compounds by sharing or transferring electrons.',
          pathId: 'CHEM_STRUCTURE_REACTIONS',
          getWorkshop: getBondLabWorkshop
        },
        {
          id: 'equation-balancer',
          label: 'Balancer',
          title: 'Equation Balancer',
          sub: 'Adjust coefficients and watch each element balance on both sides, live.',
          pathId: 'CHEM_STRUCTURE_REACTIONS',
          getWorkshop: getEquationBalancerWorkshop
        },
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
        },
        {
          id: 'quant-chem',
          label: 'Moles',
          title: 'Mole and reaction lab',
          sub: 'Convert mass to moles, read ratios, find limits, and reverse formulas.',
          pathId: 'CHEM_QUANT',
          getWorkshop: getChemistryQuantWorkshop
        },
        {
          id: 'atomic-structure',
          label: 'Atom',
          title: 'Atomic structure',
          sub: 'Build atoms and ions, and see what protons and electrons decide.',
          pathId: 'CHEM_ATOMIC',
          getWorkshop: getChemAtomicWorkshop
        },
        {
          id: 'nucleus-isotopes',
          label: 'Isotopes',
          title: 'Nucleus and isotopes',
          sub: 'Change neutrons to build isotopes without changing the element.',
          pathId: 'CHEM_NUCLEUS_ISOTOPES',
          getWorkshop: getChemNucleusWorkshop
        },
        {
          id: 'chem-bonding',
          label: 'Bonds',
          title: 'Chemical bonding',
          sub: 'Share or transfer electrons and watch stable compounds form.',
          pathId: 'CHEM_BONDING',
          getWorkshop: getChemBondingWorkshop
        },
        {
          id: 'bonding-types',
          label: 'Bond types',
          title: 'Bonding types',
          sub: 'Sort ionic, covalent, and metallic bonding by what electrons do.',
          pathId: 'CHEM_BONDING_TYPES',
          getWorkshop: getChemBondingTypesWorkshop
        },
        {
          id: 'molecular-arch',
          label: 'Shapes',
          title: 'Molecular architecture',
          sub: 'Build molecules from formulas and read their real shapes.',
          pathId: 'CHEM_ARCH',
          getWorkshop: getChemArchWorkshop
        },
        {
          id: 'mole-reactions',
          label: 'Reactions',
          title: 'Reactions and the mole',
          sub: 'Read balanced equations as ratios and build the products.',
          pathId: 'CHEM_MOLE',
          getWorkshop: getChemMoleWorkshop
        },
        {
          id: 'counting-atoms',
          label: 'Counting',
          title: 'Counting atoms',
          sub: 'Read a formula as a count and total the atoms in a molecule.',
          pathId: 'CHEM_MOLE_COUNTING',
          getWorkshop: getChemMoleCountingWorkshop
        },
        {
          id: 'biomolecules',
          label: 'Biomolecules',
          title: 'Biomolecules',
          sub: 'See why carbon builds life, and assemble the molecules of respiration.',
          pathId: 'CHEM_BIOMOLECULES',
          getWorkshop: getChemBiomoleculesWorkshop
        },
        ...getSeriesIIModules('chemistry')
      ]
    },
    physics: {
      label: 'Physics',
      title: 'Physics workshops',
      sub: 'Units, dimensions, forces, waves, electricity, and energy.',
      icon: '/icons/gateways/unit.png',
      pathId: 'PHYS_001',
      modules: [
        {
          id: 'unit-forge',
          label: 'Unit forge',
          title: 'Unit forge lab',
          sub: 'Measure, convert, build derived units, and catch impossible answers.',
          pathId: 'PHYS_001',
          getWorkshop: getUnitForgeWorkshop
        },
        ...PHYSICS_MODULES.map((module) => ({
          ...module,
          pathId: module.pathId || 'PHYS_001',
          getWorkshop: () => getPhysicsWorkshopModule(module.id).interactions
        })),
        {
          id: 'motion',
          label: 'Motion',
          title: 'Motion Lab',
          sub: 'Set a velocity, hit run, and watch the motion graphs draw themselves.',
          pathId: 'PHY_MOTION_FOUNDATIONS',
          getWorkshop: getPhysMotionWorkshop
        },
        {
          id: 'momentum',
          label: 'Collisions',
          title: 'Collision Lab',
          sub: 'Crash two carts, share momentum, and watch kinetic energy grow with speed.',
          pathId: 'PHY_ENERGY_MOMENTUM',
          getWorkshop: getPhysMomentumWorkshop
        },
        {
          id: 'forces',
          label: 'Forces',
          title: 'Forces and Newton',
          sub: 'Balance pushes, then break the balance, and feel all three of Newton’s laws.',
          pathId: 'PHY_FORCES',
          getWorkshop: getPhysForcesWorkshop
        },
        {
          id: 'si-scale',
          label: 'SI units',
          title: 'SI units and scale',
          sub: 'Cancel units, read prefixes, and keep measurements honest.',
          pathId: 'PHY_SI_SCALE',
          getWorkshop: getPhysSiScaleWorkshop
        },
        {
          id: 'scale-estimation',
          label: 'Estimation',
          title: 'Scale, estimation and errors',
          sub: 'Round to powers of ten, estimate fast, and read significant figures.',
          pathId: 'PHY_SCALE',
          getWorkshop: getPhysScaleWorkshop
        },
        {
          id: 'measurement-limits',
          label: 'Measure',
          title: 'Measurement limits',
          sub: 'Sort random from systematic error, and see why precision is bounded.',
          pathId: 'PHY_MEASUREMENT_LIMITS',
          getWorkshop: getPhysMeasurementLimitsWorkshop
        },
        {
          id: 'foundations',
          label: 'Foundations',
          title: 'Foundations and frontiers',
          sub: 'Sort phenomena by scale and see how models earn (and lose) trust.',
          pathId: 'PHY_INTRO',
          getWorkshop: getPhysFoundationsWorkshop
        },
        {
          id: 'electricity',
          label: 'Electricity',
          title: 'Circuit Bench',
          sub: 'Close the loop, drive the current, and compare series with parallel — live.',
          pathId: 'PHY_ELECTRICITY',
          getWorkshop: getPhysCircuitWorkshop
        },
        {
          id: 'optics',
          label: 'Optics',
          title: 'Reflection and refraction bench',
          sub: 'Trace rays, reason through mirrors, refraction, lenses, and Snell law.',
          pathId: 'PHY_OPTICS',
          getWorkshop: getPhysicsOpticsWorkshop
        },
        ...getSeriesIIModules('physics')
      ]
    }
  };

  /** Workshop modules attached to a topic path (for PathView's practise section). */
  export function getWorkshopsForPath(pathId) {
    const out = [];
    for (const [tid, trk] of Object.entries(TRACKS)) {
      for (const m of trk.modules) {
        if (m.pathId === pathId) out.push({ id: m.id, title: m.title, sub: m.sub, track: tid, trackLabel: trk.label });
      }
    }
    return out;
  }
</script>

<script>
  import Workshop from '../lib/components/assessments/Workshop.svelte';
  import SolveFirst from '../lib/components/assessments/SolveFirst.svelte';
  import SolveFirstForces from '../lib/components/assessments/SolveFirstForces.svelte';
  import SolveFirstCoordinates from '../lib/components/assessments/SolveFirstCoordinates.svelte';
  import SolveFirstLimits from '../lib/components/assessments/SolveFirstLimits.svelte';
  import SolveFirstNetworks from '../lib/components/assessments/SolveFirstNetworks.svelte';
  import SolveFirstDifferentiation from '../lib/components/assessments/SolveFirstDifferentiation.svelte';
  import SolveFirstMatrices from '../lib/components/assessments/SolveFirstMatrices.svelte';
  import SolveFirstBayes from '../lib/components/assessments/SolveFirstBayes.svelte';
  import SolveFirstProjectile from '../lib/components/assessments/SolveFirstProjectile.svelte';
  import { getChallengeForModule } from '../lib/content/challenges.js';
  import { getTestForModule } from '../lib/content/tests.js';
  import { getSolveFirst, getAllSolveFirst } from '../lib/content/solveFirst.js';
  import { PATHS } from '../lib/content/paths.js';
  import { progress } from '../lib/stores/progress.js';

  export let onNavigate;
  export let openTarget = null; // module id to open immediately (deep link from a topic page)
  export let onRunningChange = () => {};

  let runId = 0;
  let finished = false;
  let score = 0;
  let total = 0;
  let bestStreak = 0;
  let challenge = null; // { interactions, timeLimitSec } — active randomized run
  let test = null; // interactions[] — active strict-assessment run (Test mode)
  let solveFirst = null; // active Solve First discovery config (problem-led, no lesson first)
  const ALL_SOLVE_FIRST = getAllSolveFirst();
  let running = false;  // false = browse the module grid; true = a workshop is open
  let browseCategory = 'solve-first';
  let activeTrack = 'computer';
  let activeModuleBySubject = {
    mathematics: 'line-core',
    computer: 'binary-data',
    chemistry: 'chemistry-core',
    physics: 'units-dimensions'
  };

  // Deep link from a topic page: land with the target module already open.
  if (openTarget) {
    for (const [tid, trk] of Object.entries(TRACKS)) {
      if (trk.modules.some((m) => m.id === openTarget)) {
        activeTrack = tid;
        browseCategory = tid;
        activeModuleBySubject = { ...activeModuleBySubject, [tid]: openTarget };
        running = true;
        break;
      }
    }
  }

  $: track = TRACKS[activeTrack];
  $: browseTrack = browseCategory === 'solve-first' ? null : TRACKS[browseCategory];
  $: moduleTabs = track.modules || [];
  $: activeModuleId = activeModuleBySubject[activeTrack] || moduleTabs[0]?.id;
  $: activeModule = moduleTabs.find((item) => item.id === activeModuleId) || moduleTabs[0];
  $: workshopTitle = solveFirst ? solveFirst.title
    : test ? `${activeModule?.title || track.title} — test`
    : challenge ? `${activeModule?.title || track.title} — challenge`
    : (activeModule?.title || track.title);
  $: workshopSub = solveFirst ? solveFirst.sub
    : test ? 'One attempt per question, nothing revealed until the end. This one counts.'
    : challenge ? 'Randomized targets, one run against the clock. Every attempt is different.'
    : (activeModule?.sub || track.sub);
  $: activePathId = activeModule?.pathId || track.pathId;
  // Reading material for this workshop's topic — drives the Workshop -> Read link.
  // Only topics that exist in PATHS have supporting boards to read.
  $: topicMeta = PATHS[activePathId] || null;
  $: practiceInteractions = activeModule?.getWorkshop ? activeModule.getWorkshop() : [];
  $: interactions = test ? test : challenge ? challenge.interactions : practiceInteractions;
  $: workshopRunKey = `${activeTrack}-${activeModuleId}-${solveFirst ? 'solve-first' : test ? 'test' : challenge ? 'challenge' : 'practice'}-${runId}`;
  $: scorePct = total ? Math.round((score / total) * 100) : 0;
  $: hasChallenge = !!getChallengeForModule(activeModuleId);
  $: hasTest = !!getTestForModule(activeModuleId, practiceInteractions);
  $: hasSolveFirst = !!getSolveFirst(activeModuleId);
  // Was this module ever completed? (recordWorkshopComplete grants a one-time
  // 'workshop:<id>' W, so its presence in granted marks the module done.)
  const moduleDone = (id) => !!$progress?.ws?.granted?.[`workshop:${id}`];
  const discoveryDone = (id) => !!$progress?.discoveries?.[id]?.firstCompletedAt;
  $: solveFirstCompleted = ALL_SOLVE_FIRST.filter((item) => discoveryDone(item.id)).length;
  $: onRunningChange?.(running);

  function finishWorkshop(finalScore, finalTotal, finalStreak = 0) {
    score = finalScore;
    total = finalTotal;
    bestStreak = finalStreak;
    finished = true;
    if ((challenge || test) && activePathId) {
      // Challenge and Test runs both count as real quiz results for mastery.
      progress.recordQuizResult(activePathId, finalScore, finalTotal);
    } else {
      // Practice run: +1 per correct + 3 completion bonus, once per module ever.
      progress.recordWorkshopComplete(activeModuleId, finalScore, finalTotal, {
        bestStreak: finalStreak,
        isChallenge: false,
        metadata: { track: activeTrack, pathId: activePathId }
      });
    }
  }

  function replay() {
    if (challenge) {
      // A challenge replay is a NEW challenge — fresh random targets every run.
      challenge = getChallengeForModule(activeModuleId);
    }
    if (test) {
      // A test retake is also fresh: reshuffled bank or newly randomized items.
      test = getTestForModule(activeModuleId, practiceInteractions);
    }
    runId += 1;
    score = 0;
    total = 0;
    bestStreak = 0;
    finished = false;
  }

  function startChallenge() {
    test = null;
    challenge = getChallengeForModule(activeModuleId);
    runId += 1;
    score = 0;
    total = 0;
    bestStreak = 0;
    finished = false;
  }

  function startTest() {
    challenge = null;
    test = getTestForModule(activeModuleId, practiceInteractions);
    runId += 1;
    score = 0;
    total = 0;
    bestStreak = 0;
    finished = false;
  }

  function exitChallenge() {
    challenge = null;
    test = null;
    runId += 1;
    score = 0;
    total = 0;
    bestStreak = 0;
    finished = false;
  }

  // Solve First: a problem-led discovery run. It replaces the practice surface
  // entirely while active, so challenge/test state is cleared on entry.
  function startSolveFirst(config = getSolveFirst(activeModuleId)) {
    if (!config) return;
    if (config.track) activeTrack = config.track;
    if (config.moduleId) {
      activeModuleBySubject = { ...activeModuleBySubject, [config.track || activeTrack]: config.moduleId };
    }
    challenge = null;
    test = null;
    solveFirst = config;
    running = true;
    runId += 1;
    score = 0;
    total = 0;
    bestStreak = 0;
    finished = false;
  }

  function finishSolveFirst(result) {
    if (!result?.id) return;
    progress.recordDiscoveryComplete(result.id, { ...result, transferred: true });
  }

  function exitSolveFirst() {
    solveFirst = null;
    running = false;
    runId += 1;
    finished = false;
  }

  // Tapping a grid tile opens that workshop and keeps its subject selected
  // when the learner returns to the catalogue.
  function openModule(trackId, id) {
    activeTrack = trackId;
    browseCategory = trackId;
    activeModuleBySubject = { ...activeModuleBySubject, [trackId]: id };
    challenge = null;
    test = null;
    solveFirst = null;
    running = true;
    replay();
  }

  function backToGrid() {
    running = false;
    challenge = null;
    test = null;
    solveFirst = null;
    finished = false;
  }
</script>

<div
  class="qx-shell workshop-lab"
  class:is-running={running}
  class:solve-running={!!solveFirst}
  class:coord-arcade={solveFirst?.kind === 'coordinate-signal'}
>
  {#if !running}
    <div class="lab-header">
      <div>
        <div class="kicker">Exercises</div>
        <h1>Workshop</h1>
        <p>Choose a category, then focus on one set of activities at a time.</p>
      </div>
      {#if browseTrack}
        <img src={browseTrack.icon} alt={browseTrack.label} />
      {:else}
        <span class="lab-header-mark" aria-hidden="true">SF</span>
      {/if}
    </div>

    <nav class="category-grid" aria-label="Workshop categories">
      <button
        class="category-button featured"
        class:active={browseCategory === 'solve-first'}
        aria-pressed={browseCategory === 'solve-first'}
        on:click={() => browseCategory = 'solve-first'}
      >
        <span class="category-mark solve-mark">SF</span>
        <span><strong>Solve First</strong><small>{solveFirstCompleted}/{ALL_SOLVE_FIRST.length} complete</small></span>
      </button>
      {#each Object.entries(TRACKS) as [tid, trk] (tid)}
        <button
          class="category-button"
          class:active={browseCategory === tid}
          aria-pressed={browseCategory === tid}
          on:click={() => browseCategory = tid}
        >
          <span class="category-mark"><img src={trk.icon} alt="" /></span>
          <span>
            <strong>{trk.label}</strong>
            <small>{trk.modules.filter((m) => moduleDone(m.id)).length}/{trk.modules.length} complete</small>
          </span>
        </button>
      {/each}
    </nav>

    <div class="category-panel" id={`workshop-category-${browseCategory}`}>
      {#if browseCategory === 'solve-first'}
        <section class="solve-batch" aria-labelledby="solve-batch-title">
          <div class="solve-batch-head">
            <div>
              <span>Solve First · Discovery set</span>
              <strong id="solve-batch-title">{ALL_SOLVE_FIRST.length} problems. No lesson first.</strong>
              <small>Experiment, prove the hidden rule, then reveal the formal idea.</small>
            </div>
            <b>{solveFirstCompleted}/{ALL_SOLVE_FIRST.length}</b>
          </div>
          <div class="solve-batch-grid">
            {#each ALL_SOLVE_FIRST as item, index (item.id)}
              <button
                class="solve-batch-card"
                class:done={discoveryDone(item.id)}
                data-testid={`solve-first-${item.id}`}
                on:click={() => startSolveFirst(item)}
              >
                <span class="solve-batch-number">{String(index + 1).padStart(2, '0')}</span>
                <span class="solve-batch-copy">
                  <small>{TRACKS[item.track]?.label || 'Workshop'}</small>
                  <strong>{item.title}</strong>
                </span>
                <span class="solve-batch-state">{discoveryDone(item.id) ? 'Replay ✓' : 'Solve →'}</span>
              </button>
            {/each}
          </div>
        </section>
      {:else if browseTrack}
        <section class="ws-block" aria-labelledby={`workshop-category-title-${browseCategory}`}>
        <div class="ws-block-head">
          <img class="ws-block-icon" src={browseTrack.icon} alt="" />
          <div class="ws-block-info">
            <div class="ws-block-name" id={`workshop-category-title-${browseCategory}`}>{browseTrack.label}</div>
            <div class="ws-block-sub">{browseTrack.sub}</div>
          </div>
          <span class="ws-block-progress">{browseTrack.modules.filter((m) => moduleDone(m.id)).length}/{browseTrack.modules.length}</span>
        </div>
        <div class="ws-grid">
          {#each browseTrack.modules as item (item.id)}
            <button class="ws-tile" on:click={() => openModule(browseCategory, item.id)}>
              <span class="ws-tile-icon"><img src={browseTrack.icon} alt="" /></span>
              <span class="ws-tile-copy">
                <span class="ws-tile-name">{item.title}</span>
                <span class="ws-tile-sub">{item.sub}</span>
              </span>
              <span class="ws-tile-foot">
                <span class="ws-chip" class:done={moduleDone(item.id)}>{moduleDone(item.id) ? 'Done ✓' : 'Practice'}</span>
                {#if getSolveFirst(item.id)}<span class="ws-bolt" title="Solve First discovery available">S</span>{/if}
                {#if getChallengeForModule(item.id)}<span class="ws-bolt" title="Timed challenge available">C</span>{/if}
                {#if getTestForModule(item.id, item.getWorkshop ? item.getWorkshop() : [])}<span class="ws-bolt" title="Scored test available">T</span>{/if}
              </span>
            </button>
          {/each}
        </div>
      </section>
      {/if}
    </div>

  {:else}
    <!-- Running a workshop -->
    {#if !solveFirst}
    <header class="runner-header">
      <button class="runner-back" on:click={backToGrid} aria-label="Return to all workshops">←</button>
      <div class="runner-copy">
        <span>{track.label}</span>
        <strong>{workshopTitle}</strong>
        <small>{workshopSub}</small>
      </div>
      {#if topicMeta}
        <button class="runner-read" on:click={() => onNavigate?.('topicDetail', activePathId)}>Read</button>
      {/if}
    </header>
    {/if}

    {#if hasSolveFirst && !challenge && !test && !solveFirst}
      <div class="solve-bar">
        <div>
          <strong>No lesson first</strong>
          <small>Work the problem, prove the rule yourself, and only then see what it is called.</small>
        </div>
        <div class="mode-buttons">
          <button on:click={() => startSolveFirst()}>Solve First</button>
        </div>
      </div>
    {/if}

    {#if !challenge && !test && !solveFirst && (hasChallenge || hasTest)}
      <div class="challenge-bar">
        <div>
          <strong>Done practising?</strong>
          <small>Challenge races the clock. Test scores you cold — one attempt, no reveals.</small>
        </div>
        <div class="mode-buttons">
          {#if hasChallenge}<button on:click={startChallenge}>Challenge</button>{/if}
          {#if hasTest}<button class="test-btn" on:click={startTest}>Test</button>{/if}
        </div>
      </div>
    {/if}

    {#if (challenge || test) && !finished}
      <button class="challenge-exit" on:click={exitChallenge}>← Back to practice</button>
    {/if}

  <div class="workshop-card" class:challenge-active={!!challenge || !!test} class:solve-active={!!solveFirst}>
    {#if solveFirst}
      {#key workshopRunKey}
        {#if solveFirst.kind === 'force-lab'}
          <SolveFirstForces config={solveFirst} onDone={finishSolveFirst} onExit={exitSolveFirst} />
        {:else if solveFirst.kind === 'coordinate-signal'}
          <SolveFirstCoordinates config={solveFirst} onDone={finishSolveFirst} onExit={exitSolveFirst} />
        {:else if solveFirst.kind === 'limit-probe'}
          <SolveFirstLimits config={solveFirst} onDone={finishSolveFirst} onExit={exitSolveFirst} />
        {:else if solveFirst.kind === 'network-routing'}
          <SolveFirstNetworks config={solveFirst} onDone={finishSolveFirst} onExit={exitSolveFirst} />
        {:else if solveFirst.kind === 'fuel-rate'}
          <SolveFirstDifferentiation config={solveFirst} onDone={finishSolveFirst} onExit={exitSolveFirst} />
        {:else if solveFirst.kind === 'matrix-warp'}
          <SolveFirstMatrices config={solveFirst} onDone={finishSolveFirst} onExit={exitSolveFirst} />
        {:else if solveFirst.kind === 'bayes-screen'}
          <SolveFirstBayes config={solveFirst} onDone={finishSolveFirst} onExit={exitSolveFirst} />
        {:else if solveFirst.kind === 'projectile-arc'}
          <SolveFirstProjectile config={solveFirst} onDone={finishSolveFirst} onExit={exitSolveFirst} />
        {:else}
          <SolveFirst config={solveFirst} onDone={finishSolveFirst} onExit={exitSolveFirst} />
        {/if}
      {/key}
    {:else if finished}
      <div class="done-state">
        <div class="score-ring" class:pass={test && scorePct >= 80} class:fail={test && scorePct < 80}>{scorePct}%</div>
        <h2>{score}/{total} locked in</h2>
        {#if test}
          <div class="test-verdict" class:pass={scorePct >= 80}>{scorePct >= 80 ? '✓ Passed' : 'Not passed yet — 80% to pass'}</div>
          <p>{scorePct >= 80 ? 'Scored cold, one attempt per question, nothing revealed on the way. This result is trustworthy — the idea is genuinely yours.' : scorePct >= 50 ? 'This is what testing is for: it found the soft spots practice papered over. Revisit the practice drill, then retake — the questions reshuffle.' : 'A low test score is information, not a verdict. Run the practice drill again with fresh eyes, then come back and retake.'}</p>
          <div class="done-actions">
            <button class="primary-btn" on:click={replay}>Retake test</button>
            {#if hasChallenge}
              <button class="ghost-btn" on:click={startChallenge}>Try the challenge</button>
            {/if}
            <button class="ghost-btn" on:click={exitChallenge}>Back to practice</button>
          </div>
        {:else if challenge}
          {#if bestStreak >= 2}
            <div class="streak-badge">Best streak · {bestStreak} in a row</div>
          {/if}
          <p>{scorePct >= 80 ? 'Under time pressure, with targets you had never seen. That is real mastery.' : scorePct >= 50 ? 'Solid under pressure. Another run means brand-new targets — no memorising your way through this one.' : 'The clock is brutal at first. Every rerun is freshly randomized, so each attempt genuinely trains the skill.'}</p>
          <div class="done-actions">
            <button class="primary-btn" on:click={replay}>New challenge</button>
            {#if hasTest}
              <button class="ghost-btn" on:click={startTest}>Take the test</button>
            {/if}
            <button class="ghost-btn" on:click={exitChallenge}>Back to practice</button>
          </div>
        {:else}
          <p>{scorePct >= 80 ? 'Strong grasp. This is the confidence zone: the idea is usable, not just familiar.' : 'Replay once and aim for a cleaner run. Short repetition is where the pattern starts to feel automatic.'}</p>
          <div class="done-actions">
            <button class="primary-btn" on:click={replay}>Replay drill</button>
            {#if hasChallenge}
              <button class="ghost-btn" on:click={startChallenge}>Try the challenge</button>
            {/if}
            {#if hasTest}
              <button class="ghost-btn" on:click={startTest}>Take the test</button>
            {/if}
          </div>
        {/if}
      </div>
    {:else}
      {#key workshopRunKey}
        <Workshop interactions={interactions} timeLimitSec={challenge?.timeLimitSec || 0} assess={!!test} onDone={finishWorkshop} />
      {/key}
    {/if}
  </div>
  {/if}
</div>

<style>
  .workshop-lab {
    height: 100%;
    width: 100%;
    max-width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: clamp(20px, 4vw, 34px) var(--qx-page-pad) 32px;
    box-sizing: border-box;
    overscroll-behavior-y: contain;
  }

  .workshop-lab.is-running {
    padding:
      max(12px, env(safe-area-inset-top, 0px))
      clamp(12px, 3.5vw, 20px)
      max(22px, env(safe-area-inset-bottom, 0px));
    background:
      radial-gradient(circle at 50% -10%, color-mix(in srgb, var(--qx-accent) 8%, transparent), transparent 38%),
      var(--qx-bg);
  }

  .workshop-lab.solve-running {
    padding-inline: clamp(10px, 3vw, 18px);
  }

  .lab-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: clamp(20px, 4vw, 30px);
  }

  .lab-header-mark {
    width: 46px;
    height: 46px;
    display: grid;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid var(--qx-green);
    border-radius: 15px;
    background: var(--qx-green-soft);
    color: var(--qx-green-text);
    font-size: 13px;
    font-weight: 950;
    letter-spacing: -.02em;
    box-shadow: var(--qx-shadow-card);
  }

  .category-grid {
    width: 100%;
    display: flex;
    gap: 4px;
    margin-bottom: 20px;
    padding: 4px;
    overflow-x: auto;
    border: 1px solid var(--qx-border);
    border-radius: 18px;
    background: var(--qx-surface-2);
    scrollbar-width: none;
  }
  .category-grid::-webkit-scrollbar { display: none; }

  .category-button {
    min-width: 122px;
    min-height: 52px;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 7px 9px;
    border: 1px solid transparent;
    border-radius: 14px;
    background: transparent;
    color: var(--qx-text);
    box-shadow: none;
    font-family: var(--qx-font);
    text-align: left;
    cursor: pointer;
    transition: border-color .15s, background .15s, transform .15s;
  }

  .category-button:hover {
    background: color-mix(in srgb, var(--qx-surface) 60%, transparent);
  }

  .category-button:active {
    transform: scale(.985);
  }

  .category-button:focus-visible {
    outline: 2px solid var(--qx-accent);
    outline-offset: 2px;
  }

  .category-button.active {
    border-color: var(--qx-border);
    background: var(--qx-surface);
    box-shadow: var(--qx-shadow-card);
  }

  .category-button.featured.active {
    border-color: color-mix(in srgb, var(--qx-green) 45%, var(--qx-border));
    background: var(--qx-surface);
    box-shadow: var(--qx-shadow-card);
  }

  .category-mark {
    width: 32px;
    height: 32px;
    display: grid;
    flex: 0 0 auto;
    place-items: center;
    border-radius: 10px;
    background: transparent;
  }

  .category-mark img {
    width: 25px;
    height: 25px;
    display: block;
    object-fit: contain;
  }

  .category-mark.solve-mark {
    background: var(--qx-text);
    color: var(--qx-bg);
    font-size: 10px;
    font-weight: 950;
  }

  .category-button > span:last-child {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .category-button strong {
    overflow: hidden;
    color: var(--qx-text);
    font-size: 10.5px;
    font-weight: 900;
    line-height: 1.2;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .category-button small {
    color: var(--qx-text-faint);
    font-size: 8.5px;
    font-weight: 750;
    line-height: 1.2;
    white-space: nowrap;
  }

  .category-panel {
    min-height: 320px;
  }

  /* Workshop grid — mirrors the Path boards grid (.topic-grid / .topic-tile) */
  .ws-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 7px;
    margin-top: 4px;
  }
  .ws-tile {
    min-height: 88px;
    display: grid;
    grid-template-columns: 40px minmax(0, 1fr) auto;
    align-items: center;
    gap: 11px;
    width: 100%; text-align: left;
    padding: 11px 12px; border-radius: 17px;
    border: 1px solid transparent; background: var(--qx-surface);
    cursor: pointer; font-family: var(--qx-font);
    box-shadow: 0 1px 0 color-mix(in srgb, var(--qx-border) 72%, transparent);
    transition: border-color 0.15s, background 0.15s, transform 0.15s;
  }
  .ws-tile:hover { border-color: var(--qx-accent); background: var(--qx-accent-soft-2); transform: translateY(-1px); box-shadow: var(--qx-shadow-card); }
  .ws-tile:active { transform: scale(0.98); }
  .ws-tile-icon {
    width: 40px; height: 40px; border-radius: 12px; background: var(--qx-surface-2);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .ws-tile-icon img { width: 29px; height: 29px; object-fit: contain; display: block; }
  .ws-tile-copy { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
  .ws-tile-name {
    font-size: 13px; font-weight: 900; color: var(--qx-text);
    line-height: 1.22; overflow-wrap: anywhere;
  }
  .ws-tile-sub {
    display: -webkit-box;
    overflow: hidden;
    font-size: 10px; font-weight: 650; color: var(--qx-text-faint);
    line-height: 1.35; overflow-wrap: anywhere;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .ws-tile-foot {
    max-width: 120px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 3px;
  }
  .ws-chip {
    font-size: 9px; font-weight: 850; color: var(--qx-text-faint);
    background: transparent; padding: 3px 2px;
  }
  .ws-chip.done { color: var(--qx-green-text); background: transparent; }
  .ws-bolt {
    width: 18px; height: 18px; display: grid; place-items: center;
    border: 1px solid color-mix(in srgb, var(--qx-accent) 40%, var(--qx-border));
    border-radius: 6px; color: var(--qx-accent-text);
    background: var(--qx-accent-soft-2); padding: 0;
    font-size: 7.5px; font-weight: 950;
  }

  .runner-header {
    position: sticky;
    top: 0;
    z-index: 30;
    display: grid;
    grid-template-columns: 40px minmax(0, 1fr) auto;
    align-items: center;
    gap: 11px;
    margin: -2px 0 14px;
    padding: 8px 0 12px;
    border-bottom: 1px solid var(--qx-border);
    background: color-mix(in srgb, var(--qx-bg) 92%, transparent);
    backdrop-filter: blur(16px);
  }

  .runner-back {
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border: 1px solid var(--qx-border);
    border-radius: 13px;
    background: var(--qx-surface);
    color: var(--qx-text);
    box-shadow: var(--qx-shadow-card);
    font: 900 18px var(--qx-font);
    cursor: pointer;
  }

  .runner-copy {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .runner-copy span {
    color: var(--qx-accent);
    font-size: 9px;
    font-weight: 900;
    letter-spacing: .09em;
    text-transform: uppercase;
  }

  .runner-copy strong {
    overflow: hidden;
    color: var(--qx-text);
    font-size: 15px;
    line-height: 1.25;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .runner-copy small {
    overflow: hidden;
    color: var(--qx-text-faint);
    font-size: 10.5px;
    line-height: 1.25;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .runner-read {
    min-height: 36px;
    padding: 0 13px;
    border: 1px solid var(--qx-border);
    border-radius: 12px;
    background: var(--qx-surface);
    color: var(--qx-accent-text);
    font: 850 11px var(--qx-font);
    cursor: pointer;
  }

  @media (min-width: 620px) {
    .ws-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .category-button { min-width: 0; flex: 1 1 0; }
  }

  .kicker {
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--qx-accent);
    margin-bottom: 3px;
  }

  h1 {
    font-size: clamp(26px, 4vw, 34px);
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

  .ws-block {
    margin: 0 0 22px;
  }

  .ws-block-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 10px;
  }

  .ws-block-icon {
    width: 30px;
    height: 30px;
    object-fit: contain;
    flex: 0 0 auto;
  }

  .ws-block-info {
    min-width: 0;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .ws-block-name {
    font-size: 15px;
    font-weight: 900;
    color: var(--qx-text);
  }

  .ws-block-sub {
    font-size: 12px;
    color: var(--qx-text-dim);
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  .ws-block-progress {
    flex: 0 0 auto;
    font-size: 12px;
    font-weight: 850;
    color: var(--qx-text-faint);
    font-variant-numeric: tabular-nums;
  }

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
    width: 100%;
    max-width: 100%;
    min-width: 0;
    border: 1.5px solid var(--qx-border);
    background: var(--qx-surface);
    border-radius: var(--qx-radius-lg);
    padding: clamp(12px, 3.5vw, 18px);
    min-height: 460px;
    box-sizing: border-box;
    box-shadow: var(--qx-shadow-card);
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

  .challenge-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border: 1.5px solid var(--qx-accent);
    background: var(--qx-accent-soft);
    border-radius: var(--qx-radius-md);
    padding: 11px 13px;
    margin: 0 0 10px;
  }

  .challenge-bar strong {
    display: block;
    font-size: 13px;
    font-weight: 850;
    color: var(--qx-accent-text);
  }

  .challenge-bar small {
    display: block;
    font-size: 11.5px;
    line-height: 1.35;
    color: var(--qx-text-dim);
    margin-top: 2px;
  }

  .challenge-bar button {
    border: none;
    border-radius: 999px;
    background: var(--qx-accent);
    color: #fff;
    font-family: var(--qx-font);
    font-size: 13px;
    font-weight: 850;
    cursor: pointer;
    min-height: 36px;
    padding: 0 16px;
    flex-shrink: 0;
  }

  .challenge-exit {
    border: none;
    background: none;
    color: var(--qx-text-dim);
    font-family: var(--qx-font);
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    padding: 2px 0 8px;
  }

  .mode-buttons {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex-shrink: 0;
  }

  .challenge-bar .test-btn {
    background: var(--qx-surface);
    color: var(--qx-accent-text);
    border: 1.5px solid var(--qx-accent);
  }

  .test-verdict {
    font-size: 13px;
    font-weight: 850;
    border-radius: 999px;
    padding: 6px 14px;
    color: var(--qx-danger-text);
    background: var(--qx-danger-soft);
    border: 1px solid var(--qx-danger);
  }

  .test-verdict.pass {
    color: var(--qx-green-text);
    background: var(--qx-green-soft);
    border-color: var(--qx-green);
  }

  .score-ring.pass { border-color: var(--qx-green); color: var(--qx-green-text); }
  .score-ring.fail { border-color: var(--qx-danger); color: var(--qx-danger-text); }

  .workshop-card.challenge-active {
    border-color: var(--qx-accent);
  }

  /* Solve First takes over the card: the discovery component supplies its own
     header, progress rail and padding. Green distinguishes discovery from the
     accent-coloured challenge/test modes. */
  .workshop-card.solve-active {
    min-height: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }

  .solve-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border: 1.5px solid var(--qx-green);
    background: var(--qx-green-soft);
    border-radius: var(--qx-radius-md);
    padding: 11px 13px;
    margin: 0 0 10px;
  }

  .solve-bar strong { display: block; font-size: 13px; color: var(--qx-green-text); }
  .solve-bar small { display: block; font-size: 11.5px; color: var(--qx-text-dim); margin-top: 2px; }
  .solve-bar button {
    min-height: 36px;
    border: 0;
    border-radius: 999px;
    padding: 0 15px;
    background: var(--qx-green);
    color: #fff;
    font: 900 12px var(--qx-font);
    cursor: pointer;
  }

  @media (max-width: 380px) {
    .challenge-bar,
    .solve-bar {
      align-items: stretch;
      flex-direction: column;
    }

    .challenge-bar button,
    .solve-bar button {
      width: 100%;
      min-height: 44px;
    }

    .mode-buttons {
      width: 100%;
    }
  }

  /* Launch rail for the complete Solve First batch. */
  .solve-batch {
    border: 1.5px solid var(--qx-text);
    border-radius: 12px;
    padding: 14px;
    margin: 2px 0 22px;
    background: var(--qx-text);
    box-shadow: var(--qx-shadow-card);
  }
  .solve-batch-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }
  .solve-batch-head > div {
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
  .solve-batch-head span {
    color: var(--qx-accent);
    font-size: 9px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .1em;
  }
  .solve-batch-head strong { color: var(--qx-bg); font-size: 16px; line-height: 1.2; }
  .solve-batch-head small { color: var(--qx-bg); opacity: .72; font-size: 10.5px; line-height: 1.35; margin-top: 3px; }
  .solve-batch-head > b {
    flex: 0 0 auto;
    border-radius: var(--qx-radius-pill);
    padding: 5px 9px;
    background: color-mix(in srgb, var(--qx-bg) 14%, transparent);
    color: var(--qx-bg);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
  }
  .solve-batch-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 7px;
  }
  .solve-batch-card {
    min-width: 0;
    min-height: 67px;
    display: grid;
    grid-template-columns: 28px minmax(0, 1fr);
    grid-template-rows: 1fr auto;
    gap: 1px 8px;
    align-items: center;
    border: 1px solid color-mix(in srgb, var(--qx-bg) 24%, transparent);
    border-radius: 9px;
    padding: 9px;
    background: color-mix(in srgb, var(--qx-bg) 8%, transparent);
    color: var(--qx-bg);
    font-family: var(--qx-font);
    text-align: left;
    cursor: pointer;
    transition: border-color .15s, background .15s, transform .15s;
  }
  .solve-batch-card:hover {
    border-color: var(--qx-accent);
    background: color-mix(in srgb, var(--qx-bg) 13%, transparent);
    transform: translateY(-1px);
  }
  .solve-batch-card:last-child:nth-child(odd) { grid-column: 1 / -1; }
  .solve-batch-card:focus-visible { outline: 2px solid var(--qx-accent); outline-offset: 2px; }
  .solve-batch-card.done { border-color: color-mix(in srgb, var(--qx-green) 65%, transparent); }
  .solve-batch-number {
    grid-row: 1 / 3;
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    border-radius: 8px;
    background: var(--qx-bg);
    color: var(--qx-text);
    font-size: 10px;
    font-weight: 950;
    font-variant-numeric: tabular-nums;
  }
  .solve-batch-card.done .solve-batch-number { background: var(--qx-green-soft); color: var(--qx-green-text); }
  .solve-batch-copy { min-width: 0; display: flex; flex-direction: column; }
  .solve-batch-copy small {
    color: var(--qx-accent);
    font-size: 8px;
    font-weight: 900;
    letter-spacing: .06em;
    text-transform: uppercase;
  }
  .solve-batch-copy strong {
    overflow: hidden;
    color: var(--qx-bg);
    font-size: 11.5px;
    line-height: 1.2;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .solve-batch-state {
    color: var(--qx-bg);
    opacity: .65;
    font-size: 9px;
    font-weight: 850;
  }
  .solve-batch-card.done .solve-batch-state { color: var(--qx-green); opacity: 1; }

  @media (max-width: 380px) {
    .solve-batch-grid { grid-template-columns: 1fr; }
  }

  .streak-badge {
    font-size: 13px;
    font-weight: 850;
    color: var(--qx-green-text);
    background: var(--qx-green-soft);
    border: 1px solid var(--qx-green);
    border-radius: 999px;
    padding: 6px 14px;
  }

  .done-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .ghost-btn {
    border: 1.5px solid var(--qx-border-2);
    border-radius: 999px;
    background: var(--qx-surface);
    color: var(--qx-text-dim);
    font-family: var(--qx-font);
    font-size: 13px;
    font-weight: 850;
    cursor: pointer;
    min-height: 38px;
    padding: 0 15px;
  }

  @media (max-width: 430px) {
    .workshop-lab.is-running {
      padding-top: max(9px, env(safe-area-inset-top, 0px));
      padding-inline: 10px;
    }

    .runner-copy small {
      display: none;
    }

  }
</style>
