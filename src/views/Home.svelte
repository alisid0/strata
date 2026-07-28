<script>
  import { PATHS, PATH_GROUPS, pathsForCard } from '../lib/content/paths.js';
  import { getBoard } from '../lib/content/dynamicBoards.js';
  import { progress } from '../lib/stores/progress.js';
  import { displayName } from '../lib/stores/auth.js';
  import { getPathQuestions } from '../lib/content/questions.js';
  import QxIcon from '../lib/components/qubix/QxIcon.svelte';
  import SettingsMenu from '../lib/components/qubix/SettingsMenu.svelte';
  import CheckpointQuiz from '../lib/components/qubix/CheckpointQuiz.svelte';

  export let onNavigate; // (view, args?) => void
  let settingsOpen = false;

  const GATEWAY_META = {
    line: { icon: '/icons/gateways/line.png', tagline: 'Numbers, space & patterns' },
    bit:  { icon: '/icons/gateways/bit.png',  tagline: 'Code, logic & systems' },
    atom: { icon: '/icons/gateways/atom.png', tagline: 'Atoms, bonds & reactions' },
    unit: { icon: '/icons/gateways/unit.png', tagline: 'Forces, units & energy' }
  };

  $: overall = ($progress, progress.getOverall());
  $: streak = ($progress, progress.getStreak());
  $: ws = ($progress, progress.getWs());
  $: level = 1 + Math.floor(overall.read / 5);

  // ── Today's session (recall scheduler) ─────────────────────────────────────
  // Preferred: a real 3-question check from the board's topic bank. Fallback
  // (topics without bank questions yet): an Anki-style self-check — honest
  // self-report is the classic SRS pattern and works for every board.
  function recallQuestionsFor(cardNumber) {
    const pathId = pathsForCard(cardNumber)[0];
    if (!pathId) return null;
    const qs = (getPathQuestions(pathId, 24) || [])
      .filter(q => q.type === 'mcq' || q.type === 'truefalse')
      .slice(0, 3);
    return qs.length >= 2 ? qs : null;
  }

  $: dueCandidates = ($progress, progress.getDueBoards(20));
  $: dueMinutes = Math.max(1, Math.ceil(dueCandidates.length * 0.5));

  const SESSION_MAX = 3; // one tap reviews at most 3 boards — keeps it "~3 min"
  let recallQueue = [];
  let recallActive = null; // { cardNumber, questions } | { cardNumber, selfCheck, title }

  function startSession() {
    recallQueue = dueCandidates.slice(0, SESSION_MAX);
    nextRecall();
  }
  function nextRecall() {
    const item = recallQueue.shift();
    if (!item) { recallActive = null; return; }
    const questions = recallQuestionsFor(item.cardNumber);
    recallActive = questions
      ? { cardNumber: item.cardNumber, questions }
      : { cardNumber: item.cardNumber, selfCheck: true, title: getBoard(item.cardNumber)?.title || `Board ${item.cardNumber}` };
  }
  function finishRecall(score, total) {
    const passed = total > 0 && score / total >= 0.6;
    progress.recordRecallResult(recallActive.cardNumber, passed);
    nextRecall();
  }
  function selfCheckResult(passed) {
    const n = recallActive.cardNumber;
    progress.recordRecallResult(n, passed);
    if (!passed) {
      // "Show me again" — reread the board now; the 1-day reschedule stands.
      recallQueue = [];
      recallActive = null;
      onNavigate?.('reader', { numbers: [n], start: n });
      return;
    }
    nextRecall();
  }

  $: continuePath = ($progress, Object.entries(PATHS)
    .map(([id, manifest]) => ({ id, manifest, state: progress.getPathState(id, manifest) }))
    .filter(p => p.state.boardsRead > 0 && p.state.boardsRead < p.state.boardsTotal)
    .sort((a, b) => b.state.boardsRead - a.state.boardsRead)[0]);

  $: continuePct = continuePath ? Math.round((continuePath.state.boardsRead / continuePath.state.boardsTotal) * 100) : 0;

  // ── One "Continue now" action ──────────────────────────────────────────────
  // The single Home card, in place of the old workout/session/continue trio.
  // Priority: boards due for review (time-sensitive for memory) -> resume the
  // in-progress topic -> the Daily Workout as the default coach pick. Progress
  // decides WHICH is shown, never buries the others: a persistent link keeps
  // the 5-minute mix reachable whenever it is not already the primary.
  $: primary = dueCandidates.length
    ? {
        kind: 'review', icon: '🔥', label: 'CONTINUE NOW',
        title: `${dueCandidates.length} ${dueCandidates.length === 1 ? 'board' : 'boards'} due for review`,
        meta: `~${dueMinutes} min · keeps your streak`,
        cta: 'Review', run: startSession
      }
    : continuePath
      ? {
          kind: 'continue', icon: '▶', label: 'CONTINUE NOW',
          title: `Continue ${continuePath.manifest.name}`,
          meta: `${continuePath.state.boardsRead} / ${continuePath.state.boardsTotal} boards · ${continuePct}%`,
          cta: 'Continue', run: () => onNavigate?.('topicDetail', continuePath.id)
        }
      : {
          kind: 'workout', icon: '⚡',
          label: overall.read === 0 ? 'START HERE' : 'CONTINUE NOW',
          title: overall.read === 0 ? 'Start with a 5-minute mix' : 'Your 5-minute mix',
          meta: 'recall · weak spots · something new',
          cta: 'Start', run: () => onNavigate?.('workout')
        };

  // Home is for choosing a direction, not inspecting inventory. Keep each
  // subject door's useful description stable instead of replacing it with a
  // raw board count once the learner has started.
  const doors = Object.entries(PATH_GROUPS).map(([gid, g]) => ({
    gid,
    name: g.name,
    ...GATEWAY_META[gid]
  }));

  // A subject door always opens that subject's hub — same destination every
  // time. Progress changes what the hub recommends, never where the door leads.
  function openDoor(door) {
    onNavigate?.('subject', door.gid);
  }
</script>

<div class="qx-shell home-view">
  <!-- Header: greeting + avatar + streak -->
  <div class="header">
    <button class="avatar" on:click={() => onNavigate?.('wscore')} aria-label="Your W Score">{$displayName.charAt(0).toUpperCase()}</button>
    <div class="greeting">
      <div class="hi">Hi, {$displayName}</div>
      <div class="level">
        <span class="level-badge">Level {level}</span>
      </div>
    </div>
    <div class="w-chip" title="Ws earned">W {ws}</div>
    <div class="streak-chip">
      <QxIcon name="flame" size={14} />{streak}
    </div>
    <button class="menu-btn icon-btn" on:click={() => onNavigate?.('snippetMode')} aria-label="Snippet mode" title="Snippet mode">
      <QxIcon name="snippets" size={15} />
    </button>
    <button class="menu-btn" on:click={() => settingsOpen = true} aria-label="Settings">⋯</button>
  </div>

  <SettingsMenu open={settingsOpen} onClose={() => settingsOpen = false} onNavigate={onNavigate} />

  <!-- One state-aware "Continue now" card: due review -> resume the in-progress
       topic -> the Daily Workout default. Replaces the old always-on trio so
       Home answers "what now?" with a single confident action. -->
  <div class="focus-card">
    <button class="focus-main" on:click={primary.run}>
      <span class="focus-bolt">{primary.icon}</span>
      <span class="focus-copy">
        <span class="focus-label">{primary.label}</span>
        <span class="focus-title">{primary.title}</span>
        <span class="focus-meta">{primary.meta}</span>
      </span>
      <span class="focus-cta">{primary.cta}</span>
    </button>
    {#if primary.kind !== 'workout'}
      <button class="focus-alt" on:click={() => onNavigate?.('workout')}>or do your 5-minute mix ›</button>
    {/if}
  </div>

  {#if recallActive}
    {#key recallActive.cardNumber}
      {#if recallActive.selfCheck}
        <div class="recall-overlay" role="dialog" aria-modal="true">
          <div class="recall-sheet">
            <div class="recall-kicker">RECALL CHECK</div>
            <div class="recall-title">{recallActive.title}</div>
            <div class="recall-q">Without looking — can you still explain this board's core idea?</div>
            <div class="recall-actions">
              <button class="recall-yes" on:click={() => selfCheckResult(true)}>Still got it</button>
              <button class="recall-no" on:click={() => selfCheckResult(false)}>Fuzzy — show me again</button>
            </div>
            <div class="recall-note">Honest answers train the schedule. "Fuzzy" reopens the board and brings it back tomorrow.</div>
          </div>
        </div>
      {:else}
        <CheckpointQuiz questions={recallActive.questions} title="Recall check" onDone={finishRecall} boardIndex={recallActive.cardNumber} />
      {/if}
    {/key}
  {/if}

  <!-- The four doors -->
  <div class="doors-label">{continuePath ? 'Or start somewhere new' : 'Where would you like to start?'}</div>
  <div class="doors-grid">
    {#each doors as door (door.gid)}
      <button class="door" on:click={() => openDoor(door)}>
        <img class="door-icon" src={door.icon} alt={door.name} />
        <span class="door-name">{door.name}</span>
        <span class="door-sub">{door.tagline}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .home-view { height: 100%; overflow-y: auto; display: flex; flex-direction: column; padding: 16px 18px 0; box-sizing: border-box; }

  /* Header */
  .header {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto auto auto auto;
    align-items: center;
    gap: 9px;
    margin-bottom: 20px;
  }
  .avatar {
    width: 44px; height: 44px; border-radius: 50%; background: var(--qx-accent); color: #fff;
    font-weight: 800; font-size: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    cursor: pointer; border: none; font-family: var(--qx-font);
  }
  .greeting { flex: 1; min-width: 0; }
  .hi { font-size: 18px; font-weight: 800; color: var(--qx-text); line-height: 1.2; }
  .level { font-size: 12px; font-weight: 600; color: var(--qx-text-dim); margin-top: 2px; }
  .level-badge { color: var(--qx-accent-text); }
  .streak-chip {
    display: flex; align-items: center; gap: 4px; background: var(--qx-yellow-soft); border: 1px solid var(--qx-yellow);
    border-radius: var(--qx-radius-pill); padding: 5px 12px; color: var(--qx-yellow-text); font-size: 14px; font-weight: 800;
  }
  .w-chip {
    background: var(--qx-green-soft); border: 1px solid var(--qx-green);
    border-radius: var(--qx-radius-pill); padding: 5px 12px; color: var(--qx-green-text);
    font-size: 14px; font-weight: 900; white-space: nowrap;
  }

  /* One "Continue now" card — accent-filled so it reads as THE action */
  .focus-card { margin-bottom: 20px; }
  .focus-main {
    width: 100%; display: flex; align-items: center; gap: 12px; text-align: left;
    padding: 15px 14px; border-radius: var(--qx-radius-lg);
    border: none; background: var(--qx-accent); cursor: pointer;
    font-family: var(--qx-font); box-sizing: border-box;
  }
  .focus-bolt {
    width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0; font-size: 18px;
    background: rgba(255, 255, 255, 0.18); color: #fff;
    display: flex; align-items: center; justify-content: center;
  }
  .focus-copy { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .focus-label { font-size: 10px; font-weight: 850; letter-spacing: 0.07em; color: rgba(255, 255, 255, 0.75); }
  .focus-title { font-size: 15px; font-weight: 850; color: #fff; line-height: 1.25; }
  .focus-meta { font-size: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.78); }
  .focus-cta {
    flex-shrink: 0; padding: 8px 16px; border-radius: 999px;
    background: #fff; color: var(--qx-accent); font-size: 13px; font-weight: 900;
  }
  .focus-alt {
    display: block; width: 100%; text-align: center; margin-top: 8px; padding: 6px;
    background: none; border: none; cursor: pointer; font-family: var(--qx-font);
    font-size: 12.5px; font-weight: 750; color: var(--qx-text-dim);
  }
  .focus-alt:hover { color: var(--qx-accent-text); }

  /* Recall self-check overlay */
  .recall-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0, 0, 0, 0.45);
    display: flex; align-items: center; justify-content: center; padding: 22px;
  }
  .recall-sheet {
    width: min(380px, 100%); box-sizing: border-box;
    background: var(--qx-surface); border: 1.5px solid var(--qx-border);
    border-radius: var(--qx-radius-lg); padding: 22px 20px;
    display: flex; flex-direction: column; gap: 12px; text-align: center;
  }
  .recall-kicker { font-size: 10px; font-weight: 850; letter-spacing: 0.1em; color: var(--qx-accent-text); }
  .recall-title { font-size: 18px; font-weight: 850; color: var(--qx-text); line-height: 1.3; }
  .recall-q { font-size: 14px; font-weight: 650; color: var(--qx-text-dim); line-height: 1.45; }
  .recall-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
  .recall-yes {
    min-height: 44px; border-radius: 999px; border: none; cursor: pointer;
    background: var(--qx-green); color: #fff; font-family: var(--qx-font);
    font-size: 14px; font-weight: 850;
  }
  .recall-no {
    min-height: 44px; border-radius: 999px; cursor: pointer;
    border: 1.5px solid var(--qx-border-2); background: var(--qx-surface);
    color: var(--qx-text-dim); font-family: var(--qx-font);
    font-size: 14px; font-weight: 800;
  }
  .recall-note { font-size: 11.5px; font-weight: 600; color: var(--qx-text-faint); line-height: 1.4; }
  .menu-btn {
    width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid var(--qx-border-2);
    background: var(--qx-surface); color: var(--qx-text-dim); font-size: 22px; line-height: 1;
    cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    font-family: var(--qx-font); padding: 0 0 6px;
  }
  .menu-btn.icon-btn { padding: 0; }

  /* The four doors */
  .doors-label { font-size: 11px; font-weight: 700; color: var(--qx-text-faint); letter-spacing: 0.05em; margin-bottom: 10px; text-transform: uppercase; }
  .doors-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-bottom: 16px; }
  .door {
    display: flex; flex-direction: column; align-items: center; gap: 5px;
    padding: 20px 12px; border-radius: var(--qx-radius-lg); border: 1.5px solid var(--qx-border-2);
    background: var(--qx-surface); cursor: pointer; font-family: var(--qx-font);
    transition: border-color 0.15s, transform 0.15s;
  }
  .door:hover { border-color: var(--qx-accent); transform: translateY(-2px); }
  .door-icon { width: 56px; height: 56px; object-fit: contain; display: block; }
  .door-name { font-size: 15px; font-weight: 800; color: var(--qx-text); text-align: center; line-height: 1.18; }
  .door-sub { font-size: 11.5px; font-weight: 600; color: var(--qx-text-faint); }

  @media (max-width: 410px) {
    .header {
      grid-template-columns: auto minmax(0, 1fr) auto auto;
      grid-template-areas:
        "avatar greeting snippets menu"
        "w w streak streak";
      row-gap: 9px;
    }
    .avatar { grid-area: avatar; }
    .greeting { grid-area: greeting; }
    .w-chip { grid-area: w; justify-self: stretch; text-align: center; }
    .streak-chip { grid-area: streak; justify-content: center; }
    .menu-btn.icon-btn { grid-area: snippets; }
    .menu-btn:not(.icon-btn) { grid-area: menu; }
  }

  @media (max-width: 340px) {
    .home-view { padding-inline: 14px; }
    .doors-grid { gap: 9px; }
    .door { padding-inline: 8px; }
  }
</style>
