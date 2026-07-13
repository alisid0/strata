<script>
  import { PATHS, PATH_GROUPS, totalBoards, pathsForCard } from '../lib/content/paths.js';
  import { getBoard } from '../lib/content/dynamicBoards.js';
  import { progress } from '../lib/stores/progress.js';
  import { displayName } from '../lib/stores/auth.js';
  import { getPathQuestions } from '../lib/content/questions.js';
  import QxIcon from '../lib/components/qubix/QxIcon.svelte';
  import SettingsMenu from '../lib/components/qubix/SettingsMenu.svelte';
  import CheckpointQuiz from '../lib/components/qubix/CheckpointQuiz.svelte';

  export let onNavigate; // (view, args?) => void
  let settingsOpen = false;

  const TOTAL_BOARDS = totalBoards();

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

  // The four doors: per-gateway progress; an untouched gateway opens its
  // first topic directly, a started one opens the Path tab.
  $: doors = ($progress, Object.entries(PATH_GROUPS).map(([gid, g]) => {
    const states = g.paths.filter(id => PATHS[id]).map(id => progress.getPathState(id, PATHS[id]));
    const read = states.reduce((a, s) => a + (s.boardsRead || 0), 0);
    const total = states.reduce((a, s) => a + (s.boardsTotal || 0), 0);
    return { gid, name: g.name, firstTopic: g.firstTopic, ...GATEWAY_META[gid], read, total };
  }));

  function openDoor(door) {
    if (door.read > 0) onNavigate?.('path');
    else onNavigate?.('topicDetail', door.firstTopic);
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

  <!-- Today's session: due recalls first (time-sensitive), else caught-up /
       start states. Either this or Continue counts as the day's streak. -->
  {#if dueCandidates.length}
    <button class="session-card due" on:click={startSession}>
      <span class="session-icon"><QxIcon name="flame" size={18} /></span>
      <span class="session-info">
        <span class="session-label">TODAY'S SESSION</span>
        <span class="session-title">{dueCandidates.length} {dueCandidates.length === 1 ? 'board' : 'boards'} due for review</span>
        <span class="session-meta">~{dueMinutes} min · +5 W each</span>
      </span>
      <span class="session-cta">Review</span>
    </button>
  {:else if overall.read === 0}
    <div class="session-card start">
      <span class="session-info">
        <span class="session-label">START LEARNING</span>
        <span class="session-title">Pick a door below to begin</span>
      </span>
      <span class="session-arrow">↓</span>
    </div>
  {:else}
    <div class="session-card done">
      <span class="session-info">
        <span class="session-title">All caught up ✓</span>
        <span class="session-meta">Nothing due for review today</span>
      </span>
    </div>
  {/if}

  <!-- Continue card (only once something is in progress) -->
  {#if continuePath}
    <div class="continue-card">
      <div class="continue-ring" style="background:conic-gradient(var(--qx-accent) {continuePct * 3.6}deg, var(--qx-surface-2) 0)">
        <div class="ring-inner">{continuePct}%</div>
      </div>
      <div class="continue-info">
        <div class="continue-label">CONTINUE</div>
        <div class="continue-title">{continuePath.manifest.name}</div>
        <div class="continue-meta">{continuePath.state.boardsRead} / {continuePath.state.boardsTotal} boards</div>
      </div>
      <button class="continue-chev" on:click={() => onNavigate?.('topicDetail', continuePath.id)}>&rsaquo;</button>
    </div>
  {/if}

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
        <CheckpointQuiz questions={recallActive.questions} title="Recall check" onDone={finishRecall} />
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
        <span class="door-sub">{door.read > 0 ? `${door.read}/${door.total} boards` : door.tagline}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .home-view { height: 100%; overflow-y: auto; display: flex; flex-direction: column; padding: 16px 18px 0; box-sizing: border-box; }

  /* Header */
  .header { display: flex; align-items: center; gap: 11px; margin-bottom: 20px; }
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

  /* Today's session card */
  .session-card {
    width: 100%; display: flex; align-items: center; gap: 12px; text-align: left;
    padding: 14px; border-radius: var(--qx-radius-lg); margin-bottom: 14px;
    border: 1.5px solid var(--qx-border); background: var(--qx-surface);
    font-family: var(--qx-font); box-sizing: border-box;
  }
  button.session-card { cursor: pointer; }
  .session-card.due { border-color: var(--qx-accent); background: var(--qx-accent-soft); }
  .session-card.done { border-color: var(--qx-green); background: var(--qx-green-soft); }
  .session-icon {
    width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
    background: var(--qx-surface); color: var(--qx-accent-text);
    display: flex; align-items: center; justify-content: center;
  }
  .session-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .session-label { font-size: 10px; font-weight: 800; letter-spacing: 0.06em; color: var(--qx-text-faint); }
  .session-title { font-size: 15px; font-weight: 800; color: var(--qx-text); line-height: 1.25; }
  .session-card.done .session-title { color: var(--qx-green-text); }
  .session-meta { font-size: 12px; font-weight: 600; color: var(--qx-text-dim); }
  .session-cta {
    flex-shrink: 0; padding: 8px 16px; border-radius: 999px;
    background: var(--qx-accent); color: #fff; font-size: 13px; font-weight: 850;
  }
  .session-arrow { font-size: 20px; font-weight: 900; color: var(--qx-text-faint); }

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

  /* Continue card */
  .continue-card {
    display: flex; align-items: center; gap: 14px; padding: 14px; border-radius: var(--qx-radius-lg);
    border: 1.5px solid var(--qx-border); background: var(--qx-surface); margin-bottom: 20px;
  }
  .continue-ring {
    position: relative; width: 50px; height: 50px; flex-shrink: 0; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }
  .ring-inner {
    width: 40px; height: 40px; border-radius: 50%; background: var(--qx-surface);
    display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: var(--qx-text);
  }
  .continue-info { flex: 1; min-width: 0; }
  .continue-label { font-size: 11px; font-weight: 700; color: var(--qx-text-faint); letter-spacing: 0.04em; margin-bottom: 3px; }
  .continue-title { font-size: 15px; font-weight: 800; color: var(--qx-text); line-height: 1.2; }
  .continue-meta { font-size: 12px; font-weight: 500; color: var(--qx-text-dim); margin-top: 3px; }
  .continue-chev {
    background: none; border: none; font-size: 24px; color: var(--qx-text-faint); cursor: pointer; padding: 4px;
  }

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
</style>
