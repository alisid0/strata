<script>
  import { PATHS, SUBJECT_PATHS, SUBJECT_LABELS, totalBoards } from '../lib/content/paths.js';
  import { progress } from '../lib/stores/progress.js';
  import SubjectMark from '../lib/components/SubjectMark.svelte';

  const TOTAL_BOARDS = totalBoards();

  $: overall = $progress ? progress.getOverall() : { read: 0 };
  $: pct = Math.round((overall.read / TOTAL_BOARDS) * 100);
  $: level = 1 + Math.floor(overall.read / 5);

  const STATE_LABELS = {
    unwandered: 'Not started', wandered: 'Wandered', checked: 'Checked',
    well_read: 'Well read', recalled: 'Recalled', mastered_1: 'Mastered ×1', mastered_2: 'Mastered ×2'
  };

  export let onNavigate; // (view, pathId?) => void

  function getSubjectData(subject) {
    const pathIds = SUBJECT_PATHS[subject];
    let totalCards = 0, readCards = 0, bestPathLabel = null;
    pathIds.forEach(pid => {
      const manifest = PATHS[pid];
      const st = progress.getPathState(pid, manifest);
      totalCards += st.boardsTotal;
      readCards += st.boardsRead;
      if (st.state !== 'unwandered') bestPathLabel = `${manifest.name} — ${STATE_LABELS[st.state]}`;
    });
    const ringPct = totalCards > 0 ? readCards / totalCards : 0;
    const dashoffset = 126 * (1 - ringPct);
    return { totalCards, readCards, ringPct, dashoffset, bestPathLabel };
  }
</script>

<div class="subjects-view">
  <div class="topline">
    <div class="brand">STRATA</div>
    <div class="level-chip">Lv.{level} · Explorer</div>
  </div>

  <h1>Your tracks</h1>
  <p class="sub">Three subjects, one map that only grows.</p>

  <div class="meter-label">
    <span>{overall.read} of {TOTAL_BOARDS} boards read</span>
    <span>{pct}%</span>
  </div>
  <div class="meter">
    <div class="meter-fill" style="width:{pct}%"></div>
  </div>

  <div class="subjects-grid">
    {#each Object.keys(SUBJECT_PATHS) as subject}
      {@const data = getSubjectData(subject)}
      <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
      <div class="subject-card" on:click={() => onNavigate?.('subject', subject)} role="button" tabindex="0">
        <div class="ring">
          <svg viewBox="0 0 44 44">
            <circle class="progress-bg" cx="22" cy="22" r="20"/>
            <circle class="progress-arc" cx="22" cy="22" r="20"
              style="stroke-dashoffset:{data.dashoffset}"/>
          </svg>
          <div class="mark">
            <SubjectMark subject={subject} accent="#f2d585" size={26} />
          </div>
        </div>
        <div class="info">
          <div class="name">{SUBJECT_LABELS[subject]}</div>
          <div class="count">{data.readCards} / {data.totalCards} boards</div>
          <div class="status">{data.bestPathLabel || 'Not started yet'}</div>
        </div>
        <div class="chev">›</div>
      </div>
    {/each}
  </div>

  <p class="footer-note">Read → Tested → Recalled. Mastery stacks; nothing resets.</p>
</div>

<style>
  .subjects-view {
    height: 100%;
    overflow-y: auto;
    padding: 24px 18px 100px;
    background: var(--board-1);
    border: 12px solid var(--frame);
    border-radius: 6px;
    box-shadow: 0 0 0 2px var(--frame-dark), 0 30px 70px -28px rgba(0,0,0,0.85), inset 0 0 80px rgba(0,0,0,0.35);
  }
  .topline {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
  }
  .brand {
    font-family: var(--print); font-size: 13px; letter-spacing: 0.1em; color: var(--chalk-yellow);
  }
  .level-chip {
    font-family: var(--print); font-size: 12px; color: var(--board-1);
    background: var(--chalk-yellow); border-radius: 14px;
    padding: 3px 12px; transform: rotate(-1.5deg);
  }
  h1 {
    font-family: var(--hand-display); font-weight: 400;
    font-size: 32px; margin-bottom: 4px;
    text-shadow: 0 1px 0 rgba(0,0,0,0.25);
  }
  .sub {
    font-family: var(--print); color: var(--chalk-faint); font-size: 14px; margin-bottom: 22px;
  }
  .meter-label {
    display: flex; justify-content: space-between;
    font-family: var(--print); font-size: 12.5px; color: var(--chalk-green); margin-bottom: 5px;
  }
  .meter {
    height: 8px; border-radius: 4px; background: rgba(0,0,0,0.3);
    border: 1.2px dashed var(--chalk-faint); overflow: hidden; margin-bottom: 18px;
  }
  .meter-fill {
    height: 100%; background: var(--chalk-yellow); border-radius: 4px;
    transition: width 0.4s ease;
  }
  .subjects-grid {
    display: flex; flex-direction: column; gap: 11px;
  }
  .subject-card {
    display: flex; align-items: center; gap: 13px;
    background: rgba(0,0,0,0.18);
    border: 1.5px dashed var(--chalk-faint);
    border-radius: 12px; padding: 12px;
    cursor: pointer;
  }
  .subject-card:active { background: rgba(0,0,0,0.3); }
  .ring {
    width: 52px; height: 52px; flex-shrink: 0; border-radius: 50%;
    background: var(--board-2); display: flex; align-items: center;
    justify-content: center; position: relative;
  }
  .ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
  .ring .progress-bg { fill: none; stroke: var(--chalk-faint); stroke-width: 3; opacity: 0.4; }
  .ring .progress-arc {
    fill: none; stroke: var(--chalk-yellow); stroke-width: 3;
    stroke-linecap: round; stroke-dasharray: 126;
    transition: stroke-dashoffset 0.5s ease;
  }
  .mark { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
  .info { flex: 1; min-width: 0; }
  .info .name { font-family: var(--hand-display); font-size: 19px; color: var(--chalk); }
  .info .count { font-family: var(--hand); font-size: 12.5px; color: var(--chalk-faint); margin: 2px 0 3px; }
  .info .status { font-family: var(--print); font-size: 12px; color: var(--chalk-green); }
  .chev { color: var(--chalk-faint); font-size: 18px; }
  .footer-note {
    font-family: var(--print); font-size: 12px; color: var(--chalk-faint);
    text-align: center; margin-top: 28px; opacity: 0.7;
  }
</style>
