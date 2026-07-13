<script>
  import { PATHS, totalBoards } from '../lib/content/paths.js';
  import { progress } from '../lib/stores/progress.js';
  import { displayName } from '../lib/stores/auth.js';
  import { getLeague } from '../lib/stores/league.js';

  export let onNavigate;

  const TOTAL_BOARDS = totalBoards();

  // All real, derived from local progress (referencing $progress to stay reactive).
  $: overall = ($progress, progress.getOverall());
  $: pct = TOTAL_BOARDS ? Math.round((overall.read / TOTAL_BOARDS) * 100) : 0;
  $: streak = ($progress, progress.getStreak());
  $: ws = ($progress, progress.getWs());
  $: weeklyPoints = ($progress, progress.getWeeklyPoints());
  $: league = ($progress, getLeague());
  $: yourRank = league.members.findIndex(m => m.isYou) + 1;
  $: activity = ($progress, progress.getActivity(7));
  $: activeDays = activity.filter(a => a.active).length;
  $: pace = ($progress, progress.getPace());
  $: medals = ($progress, progress.getMedals());
  $: earnedMedals = medals.filter(m => m.earned);
  $: started = ($progress, Object.values(PATHS).filter(m => m.cards.some(n => $progress.boards && $progress.boards[n] && $progress.boards[n].firstOpenedAt)).length);
  $: topicsTotal = Object.keys(PATHS).length;
  $: quizzesTaken = ($progress, Object.values($progress.quizzes || {}).reduce((a, arr) => a + (arr ? arr.length : 0), 0));

  function barH(count) {
    if (!count) return 6;
    return Math.min(100, 30 + count * 20);
  }
</script>

<div class="qx-shell stats-view">
  <div class="top-row">
    <div class="top-left">
      <h1>W Score</h1>
    </div>
    <div class="avatar">{$displayName.charAt(0).toUpperCase()}</div>
  </div>

  <!-- W hero: the primary metric -->
  <div class="w-hero">
    <div class="w-hero-number">W {ws}</div>
    <div class="w-hero-sub">
      {#if ws === 0}Your journey starts here{:else}this week: {weeklyPoints} pts{/if}
    </div>
  </div>

  <!-- Boards read + Streak -->
  <div class="top-cards">
    <div class="tc-card">
      <div class="tc-label">Boards read</div>
      <div class="tc-value">{overall.read}/{TOTAL_BOARDS}</div>
    </div>
    <div class="tc-card streak-card">
      <div class="tc-label">Streak</div>
      <div class="tc-value">🔥 {streak} <span class="tc-unit">{streak === 1 ? 'day' : 'days'}</span></div>
    </div>
  </div>

  <!-- Consistency (last 7 days) -->
  <div class="section-label">This week</div>
  <div class="consistency-row">
    {#each activity as d}
      <div class="bar-col">
        <div class="bar-track"><div class="bar-fill" class:on={d.active} style="height:{barH(d.count)}%"></div></div>
        <span class="bar-day">{d.weekday}</span>
      </div>
    {/each}
    <span class="consistency-summary">{activeDays} of 7 days</span>
  </div>

  <!-- League (local-first preview) -->
  <div class="league-head">
    <span class="section-label">{league.name} · you're #{yourRank}</span>
    <span class="league-reset">Resets Monday</span>
  </div>
  <div class="league-card">
    {#each league.members.slice(0, Math.max(8, yourRank + 1)) as m, i}
      <div class="league-row" class:you={m.isYou}>
        <span class="league-rank">{i + 1}</span>
        <span class="league-avatar">{m.name.charAt(0)}</span>
        <span class="league-name">{m.name}</span>
        <span class="league-pts">{m.points} pts</span>
      </div>
    {/each}
    <div class="league-note">Preview league — goes live with accounts.</div>
  </div>

  <!-- Metrics -->
  <div class="metrics-row">
    <div class="metric">
      <div class="metric-label">This week</div>
      <div class="metric-value">{pace}</div>
    </div>
    <div class="metric">
      <div class="metric-label">Checks</div>
      <div class="metric-value">{quizzesTaken}</div>
    </div>
    <div class="metric">
      <div class="metric-label">Topics</div>
      <div class="metric-value">{started}/{topicsTotal}</div>
    </div>
  </div>

  <!-- Medals -->
  <div class="section-label">Medals &middot; {earnedMedals.length} earned</div>
  {#if earnedMedals.length}
    <div class="medal-row">
      {#each earnedMedals as m}
        <div class="medal-chip">🏅 {m.label}</div>
      {/each}
    </div>
  {:else}
    <div class="medal-empty">Read a board or pass a check to earn your first medal.</div>
  {/if}
</div>

<style>
  .stats-view { height: 100%; overflow-y: auto; padding: 16px 18px 24px; box-sizing: border-box; }
  .top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .top-left { display: flex; align-items: center; gap: 10px; }
  h1 { font-size: 23px; font-weight: 800; color: var(--qx-text); margin: 0; }
  .avatar {
    width: 36px; height: 36px; border-radius: 50%; background: var(--qx-accent); color: #fff;
    font-weight: 800; font-size: 15px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }

  /* W hero */
  .w-hero {
    text-align: center; padding: 18px 0 22px;
  }
  .w-hero-number {
    font-size: 52px; font-weight: 900; color: var(--qx-green-text); line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .w-hero-sub { font-size: 13px; font-weight: 700; color: var(--qx-text-dim); margin-top: 6px; }

  /* League */
  .league-head { display: flex; justify-content: space-between; align-items: baseline; }
  .league-reset { font-size: 11px; font-weight: 700; color: var(--qx-text-faint); }
  .league-card {
    border: 1.5px solid var(--qx-border); background: var(--qx-surface);
    border-radius: var(--qx-radius-md); padding: 6px 0 0; margin-bottom: 20px;
  }
  .league-row {
    display: flex; align-items: center; gap: 10px; padding: 8px 14px;
    font-size: 13px; font-weight: 700; color: var(--qx-text);
  }
  .league-row.you { background: var(--qx-accent-soft); }
  .league-rank { width: 20px; text-align: right; color: var(--qx-text-faint); font-variant-numeric: tabular-nums; }
  .league-avatar {
    width: 26px; height: 26px; border-radius: 50%; background: var(--qx-surface-2);
    color: var(--qx-text-dim); font-size: 12px; font-weight: 800;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .league-row.you .league-avatar { background: var(--qx-accent); color: #fff; }
  .league-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .league-pts { color: var(--qx-text-dim); font-variant-numeric: tabular-nums; }
  .league-note {
    padding: 8px 14px 10px; font-size: 11px; font-weight: 600; color: var(--qx-text-faint);
    border-top: 1px solid var(--qx-border);
  }

  .top-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
  .tc-card { border: 1.5px solid var(--qx-border); background: var(--qx-surface); border-radius: var(--qx-radius-md); padding: 14px; }
  .tc-label { font-size: 11px; font-weight: 700; color: var(--qx-text-faint); margin-bottom: 4px; }
  .tc-value { font-size: 20px; font-weight: 800; color: var(--qx-text); }
  .tc-unit { font-size: 13px; font-weight: 600; color: var(--qx-text-dim); }

  .section-label { font-size: 12px; font-weight: 700; color: var(--qx-text-dim); margin-bottom: 10px; }

  /* Consistency */
  .consistency-row { display: flex; gap: 6px; align-items: flex-end; height: 70px; margin-bottom: 30px; position: relative; }
  .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; gap: 4px; }
  .bar-track { flex: 1; width: 100%; display: flex; align-items: flex-end; border-radius: 5px; overflow: hidden; background: var(--qx-surface-2); }
  .bar-fill { width: 100%; background: var(--qx-border-2); border-radius: 5px 5px 0 0; transition: height 0.3s; }
  .bar-fill.on { background: var(--qx-accent); }
  .bar-day { font-size: 10px; font-weight: 600; color: var(--qx-text-faint); }
  .consistency-summary { font-size: 12px; font-weight: 600; color: var(--qx-text-faint); position: absolute; bottom: -20px; right: 0; }

  /* Metrics */
  .metrics-row { display: flex; gap: 10px; margin-bottom: 20px; }
  .metric { flex: 1; border: 1.5px solid var(--qx-border); background: var(--qx-surface); border-radius: var(--qx-radius-md); padding: 12px; text-align: center; }
  .metric-label { font-size: 11px; font-weight: 700; color: var(--qx-text-faint); margin-bottom: 3px; }
  .metric-value { font-size: 17px; font-weight: 800; color: var(--qx-text); }

  /* Medals */
  .medal-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
  .medal-chip { font-size: 12px; font-weight: 700; color: var(--qx-yellow-text); background: var(--qx-yellow-soft); border-radius: var(--qx-radius-pill); padding: 7px 13px; }
  .medal-empty { font-size: 13px; color: var(--qx-text-faint); margin-bottom: 20px; }
</style>
