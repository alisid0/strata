<script>
  // Subject hub — the consistent destination for a subject door. A door ALWAYS
  // opens this view for its subject; progress only decides which action is
  // emphasized (Continue), never where the door leads. Browse-all stays on the
  // Path tab; this is the focused single-subject home.
  import { PATHS, PATH_GROUPS, ROADMAP, pathsForCard } from '../lib/content/paths.js';
  import { progress } from '../lib/stores/progress.js';

  export let gid = 'line';
  export let onNavigate; // (view, args?) => void

  const GATEWAY_META = {
    line: { icon: '/icons/gateways/line.png', tagline: 'Numbers, space & patterns' },
    bit:  { icon: '/icons/gateways/bit.png',  tagline: 'Code, logic & systems' },
    atom: { icon: '/icons/gateways/atom.png', tagline: 'Atoms, bonds & reactions' },
    unit: { icon: '/icons/gateways/unit.png', tagline: 'Forces, units & energy' }
  };

  $: group = PATH_GROUPS[gid] || null;
  $: meta = GATEWAY_META[gid] || {};
  $: roadmap = ROADMAP[gid] || [];

  $: topics = ($progress, group
    ? group.paths.filter((id) => PATHS[id]).map((id) => ({ id, manifest: PATHS[id], state: progress.getPathState(id, PATHS[id]) }))
    : []);
  $: read = topics.reduce((a, t) => a + (t.state.boardsRead || 0), 0);
  $: total = topics.reduce((a, t) => a + (t.state.boardsTotal || 0), 0);
  $: pct = total ? Math.round((read / total) * 100) : 0;

  // Continue: resume the most-progressed in-flight topic; else the first
  // unstarted; else the first topic. Progress picks WHICH, never WHERE.
  $: inProgress = topics
    .filter((t) => t.state.boardsRead > 0 && t.state.boardsRead < t.state.boardsTotal)
    .sort((a, b) => b.state.boardsRead - a.state.boardsRead)[0];
  $: nextTopic = inProgress || topics.find((t) => !(t.state.boardsRead > 0)) || topics[0];
  $: continueLabel = inProgress ? 'Continue learning' : read > 0 ? 'Keep going' : 'Start learning';

  // Review: boards due today that belong to this subject.
  $: pathSet = new Set(group ? group.paths : []);
  $: dueForSubject = ($progress, progress
    .getDueBoards(60)
    .filter((d) => pathsForCard(d.cardNumber).some((p) => pathSet.has(p))));

  function goContinue() { if (nextTopic) onNavigate?.('topicDetail', nextTopic.id); }
  function goPractise() { onNavigate?.('workshop'); }
  function goReview() {
    if (!dueForSubject.length) return;
    const nums = dueForSubject.map((d) => d.cardNumber);
    onNavigate?.('reader', { numbers: nums, start: nums[0] });
  }

  const topicLabel = (s) =>
    !s.boardsRead
      ? 'Not started'
      : s.boardsTotal && s.boardsRead >= s.boardsTotal
        ? 'Done ✓'
        : `${s.boardsRead}/${s.boardsTotal}`;
</script>

<div class="qx-shell subject-view">
  <div class="topbar">
    <button class="back-chev" on:click={() => onNavigate?.('home')} aria-label="Back to home">‹</button>
    <span class="topbar-subject">{group?.name || 'Subject'}</span>
  </div>

  {#if group}
    <!-- Identity + aggregate progress -->
    <div class="hero">
      <img class="hero-icon" src={meta.icon} alt="" />
      <div class="hero-info">
        <h1>{group.name}</h1>
        <p>{meta.tagline}</p>
        <div class="meter"><div class="meter-fill" style="width:{pct}%"></div></div>
        <div class="hero-meta">{read} / {total} boards · {pct}%</div>
      </div>
    </div>

    <!-- Actions. Progress decides which is emphasized, not where the door led. -->
    <button class="act act-primary" on:click={goContinue}>
      <span class="act-copy">
        <span class="act-label">{continueLabel}</span>
        {#if nextTopic}<span class="act-sub">{nextTopic.manifest.name}</span>{/if}
      </span>
      <span class="act-go">›</span>
    </button>

    <div class="act-row">
      <button class="act act-sec" on:click={goPractise}>
        <span class="act-label">Practise</span>
        <span class="act-sub">Hands-on drills</span>
      </button>
      <button
        class="act act-sec"
        class:muted={!dueForSubject.length}
        on:click={goReview}
        disabled={!dueForSubject.length}
      >
        <span class="act-label">Review{dueForSubject.length ? ` (${dueForSubject.length})` : ''}</span>
        <span class="act-sub">{dueForSubject.length ? 'Due today' : 'Caught up ✓'}</span>
      </button>
    </div>

    <!-- Topics -->
    <div class="section-label">Topics</div>
    <div class="topic-list">
      {#each topics as t (t.id)}
        <button class="topic-tile" on:click={() => onNavigate?.('topicDetail', t.id)}>
          <span class="topic-name">{t.manifest.name}</span>
          <span
            class="topic-state"
            class:started={t.state.boardsRead > 0}
            class:done={t.state.boardsTotal > 0 && t.state.boardsRead >= t.state.boardsTotal}
          >{topicLabel(t.state)}</span>
        </button>
      {/each}
    </div>

    {#if roadmap.length}
      <div class="section-label">Up next</div>
      <div class="roadmap">
        {#each roadmap as name}<span class="road-chip">{name}</span>{/each}
      </div>
    {/if}
  {:else}
    <div class="empty">Subject not found.</div>
  {/if}
</div>

<style>
  .subject-view { height: 100%; overflow-y: auto; padding: 16px 18px 28px; box-sizing: border-box; }

  /* Topbar */
  .topbar { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .back-chev {
    width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid var(--qx-border-2);
    background: var(--qx-surface); color: var(--qx-text); font-size: 22px; line-height: 1;
    cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    font-family: var(--qx-font);
  }
  .topbar-subject { font-size: 13px; font-weight: 800; letter-spacing: 0.04em; color: var(--qx-text-dim); text-transform: uppercase; }

  /* Hero */
  .hero { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 18px; }
  .hero-icon { width: 56px; height: 56px; border-radius: 14px; flex-shrink: 0; object-fit: cover; }
  .hero-info { flex: 1; min-width: 0; }
  .hero-info h1 { font-size: 22px; font-weight: 850; color: var(--qx-text); margin: 0; line-height: 1.15; }
  .hero-info p { font-size: 13px; font-weight: 600; color: var(--qx-text-dim); margin: 3px 0 10px; }
  .meter { height: 6px; border-radius: 3px; background: var(--qx-border-2); overflow: hidden; }
  .meter-fill { height: 100%; background: var(--qx-accent); border-radius: 3px; transition: width 0.3s ease; }
  .hero-meta { font-size: 12px; font-weight: 700; color: var(--qx-text-faint); margin-top: 6px; }

  /* Actions */
  .act {
    width: 100%; display: flex; align-items: center; gap: 12px; text-align: left;
    border-radius: var(--qx-radius-lg); font-family: var(--qx-font); cursor: pointer;
    box-sizing: border-box; border: 1.5px solid var(--qx-border);
  }
  .act-copy { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .act-label { font-size: 15px; font-weight: 850; line-height: 1.2; }
  .act-sub { font-size: 12px; font-weight: 600; opacity: 0.85; }
  .act-primary {
    background: var(--qx-accent); border-color: transparent; color: #fff;
    padding: 15px 16px; margin-bottom: 10px;
  }
  .act-go { font-size: 22px; font-weight: 900; flex-shrink: 0; }
  .act-row { display: flex; gap: 10px; margin-bottom: 22px; }
  .act-sec {
    flex: 1; flex-direction: column; align-items: flex-start; gap: 3px;
    background: var(--qx-surface); color: var(--qx-text); padding: 13px 14px;
  }
  .act-sec .act-sub { color: var(--qx-text-dim); }
  .act-sec.muted { opacity: 0.6; cursor: default; }

  /* Topics */
  .section-label { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; color: var(--qx-text-faint); text-transform: uppercase; margin-bottom: 10px; }
  .topic-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 22px; }
  .topic-tile {
    width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 10px;
    padding: 13px 14px; border-radius: var(--qx-radius-lg); border: 1.5px solid var(--qx-border);
    background: var(--qx-surface); cursor: pointer; font-family: var(--qx-font); text-align: left;
  }
  .topic-name { font-size: 14px; font-weight: 750; color: var(--qx-text); min-width: 0; }
  .topic-state { font-size: 12px; font-weight: 800; color: var(--qx-text-faint); flex-shrink: 0; }
  .topic-state.started { color: var(--qx-accent-text); }
  .topic-state.done { color: var(--qx-green-text); }

  /* Roadmap */
  .roadmap { display: flex; flex-wrap: wrap; gap: 8px; }
  .road-chip {
    font-size: 12px; font-weight: 700; color: var(--qx-text-dim);
    background: var(--qx-surface-2); border: 1px solid var(--qx-border);
    border-radius: var(--qx-radius-pill); padding: 6px 12px;
  }

  .empty { color: var(--qx-text-dim); font-weight: 700; padding: 40px 0; text-align: center; }
</style>
